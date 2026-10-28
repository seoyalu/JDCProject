import { describe, expect, it } from "vitest";
import {
  campusReducer,
  currentTime,
  growth,
  initialState,
  isVerified,
  missionStatus,
  restoreState,
} from "./campus";
import type { CampusState } from "./campus";
import { missions, SEASON } from "../../domains/missions/catalog";
const at = SEASON.demoNow;
const verified = () =>
  campusReducer(initialState(), { type: "verify", enrollment: "재학", at });
function complete(s: CampusState, id: string, answer?: string) {
  const m = missions.find((m) => m.id === id)!;
  s = campusReducer(s, { type: "start", missionId: id, at });
  return campusReducer(s, {
    type: "complete",
    missionId: id,
    at,
    method: m.methods[0],
    answer,
  });
}
describe("winter campus journey", () => {
  it("starts unverified and awards 500P only once for either enrollment status", () => {
    expect(initialState().points).toBe(0);
    for (const enrollment of ["재학", "휴학"] as const) {
      const s = campusReducer(initialState(), {
        type: "verify",
        enrollment,
        at,
      });
      expect(s.points).toBe(500);
      expect(isVerified(s, at)).toBe(true);
      expect(campusReducer(s, { type: "verify", enrollment, at })).toBe(s);
    }
  });
  it("locks field missions until university verification and airport arrival", () => {
    const m = missions.find((m) => m.id === "seongsan")!;
    expect(missionStatus(initialState(), m)).toBe("잠금");
    expect(complete(initialState(), "airport").completed).toHaveLength(0);
    let s = verified();
    expect(complete(s, "seongsan")).toBe(s);
    s = complete(s, "airport");
    expect(s.points).toBe(1000);
    expect(missionStatus(s, m)).toBe("참여 가능");
  });
  it("completes the full pre-trip to arrival to onsite to coupon flow", () => {
    let s = complete(
      verified(),
      "bucket-list",
      JSON.stringify(["성산일출봉에서 겨울 바다 보기"]),
    );
    expect(s.points).toBe(600);
    s = complete(s, "airport");
    s = complete(s, "seongsan");
    expect(s.points).toBe(1250);
    expect(s.xp).toBe(250);
    expect(s.completed).toHaveLength(3);
    const result = campusReducer(s, {
      type: "exchange",
      rewardId: "discount10",
      id: "c1",
      at,
    });
    expect(result.points).toBe(750);
    expect(result.xp).toBe(250);
    expect(result.completed).toEqual(s.completed);
    expect(restoreState(JSON.stringify(result))).toEqual(result);
  });
  it("requires participation start, supported method and valid form answers", () => {
    const s = verified();
    expect(
      campusReducer(s, {
        type: "complete",
        missionId: "airport",
        method: "qr",
        at,
      }),
    ).toBe(s);
    const started = campusReducer(s, {
      type: "start",
      missionId: "airport",
      at,
    });
    expect(
      campusReducer(started, {
        type: "complete",
        missionId: "airport",
        method: "app",
        at,
      }),
    ).toBe(started);
    expect(
      complete(s, "wishlist", JSON.stringify(["제주 감귤 초콜릿"])).points,
    ).toBe(500);
    expect(
      complete(
        s,
        "wishlist",
        JSON.stringify(["제주 감귤 초콜릿", "시트러스 향수", "보습 스킨케어"]),
      ).points,
    ).toBe(600);
    expect(complete(s, "winter-taste", "고요한 바다 산책").points).toBe(550);
  });
  it("prevents duplicate mission rewards and validates friend plans", () => {
    const s = complete(verified(), "airport");
    expect(complete(s, "airport")).toBe(s);
    expect(
      complete(
        verified(),
        "friend-plan",
        JSON.stringify({
          friend: "제주친구",
          place: "협재해변에서 천천히 걷기",
        }),
      ).points,
    ).toBe(700);
    expect(
      complete(
        verified(),
        "friend-plan",
        JSON.stringify({ friend: "a", place: "invalid" }),
      ).points,
    ).toBe(500);
  });
  it("validates prerequisite and minimum text for after-trip records", () => {
    expect(
      complete(verified(), "travel-record", "즐거웠던 제주 여행").points,
    ).toBe(500);
    const s = complete(verified(), "airport");
    expect(complete(s, "travel-record", "짧음").points).toBe(1000);
    expect(complete(s, "travel-record", "즐거웠던 제주 여행").points).toBe(
      1050,
    );
  });
  it("supports scheduled, ended, started, and completed mission states", () => {
    const s = verified();
    const m = missions.find((m) => m.id === "seongsan")!;
    expect(missionStatus(s, m, "2026-12-19T12:00:00+09:00")).toBe("예정");
    expect(missionStatus(s, m, SEASON.end)).toBe("종료");
    const arrived = complete(s, "airport");
    const started = campusReducer(arrived, {
      type: "start",
      missionId: "seongsan",
      at,
    });
    expect(missionStatus(started, m)).toBe("진행 중");
    const done = complete(started, "seongsan");
    expect(missionStatus(done, m, "2027-04-01T00:00:00+09:00")).toBe("완료");
    expect(currentTime(initialState())).toBe(SEASON.demoNow);
  });
  it("does not complete a seasonal mission before start or at the exclusive end", () => {
    const s = complete(verified(), "airport");
    for (const time of ["2026-12-19T12:00:00+09:00", SEASON.end]) {
      expect(
        campusReducer(s, { type: "start", missionId: "seongsan", at: time }),
      ).toBe(s);
    }
  });
  it("calculates level and max-level progress without consuming XP", () => {
    expect(growth(299)).toMatchObject({ level: 1, remaining: 1 });
    expect(growth(300)).toMatchObject({ level: 2, remaining: 300 });
    expect(growth(1500)).toMatchObject({
      level: 5,
      progress: 100,
      remaining: 0,
    });
  });
  it("awards friend invitation points once and requires verified membership", () => {
    const action = { type: "inviteSuccess" as const, at };
    expect(campusReducer(initialState(), action)).toEqual(initialState());
    const s = campusReducer(verified(), action);
    expect(s.points).toBe(800);
    expect(campusReducer(s, action)).toBe(s);
    expect(restoreState(JSON.stringify(s))).toEqual(s);
  });
  it("rejects insufficient points, bad IDs, invalid dates and duplicate coupon IDs", () => {
    const s = verified();
    const issued = campusReducer(s, {
      type: "exchange",
      rewardId: "discount10",
      id: "c",
      at,
    });
    expect(
      campusReducer(issued, {
        type: "exchange",
        rewardId: "shipping",
        id: "x",
        at,
      }),
    ).toBe(issued);
    for (const action of [
      { type: "exchange" as const, rewardId: "fake", id: "c", at },
      { type: "exchange" as const, rewardId: "shipping", id: " ", at },
      {
        type: "exchange" as const,
        rewardId: "shipping",
        id: "c",
        at: "invalid",
      },
    ])
      expect(campusReducer(s, action)).toBe(s);
    const wealthy = complete(issued, "airport");
    expect(
      campusReducer(wealthy, {
        type: "exchange",
        rewardId: "shipping",
        id: "c",
        at,
      }),
    ).toBe(wealthy);
  });
  it("enforces coupon issue/expiry boundaries and one-time usage", () => {
    const s = campusReducer(verified(), {
      type: "exchange",
      rewardId: "discount10",
      id: "c",
      at,
    });
    for (const time of [
      "2027-01-04T00:00:00Z",
      s.coupons[0].expiresAt,
      "invalid",
    ])
      expect(campusReducer(s, { type: "useCoupon", id: "c", at: time })).toBe(
        s,
      );
    const used = campusReducer(s, { type: "useCoupon", id: "c", at });
    expect(used.coupons[0].usedAt).toBe(at);
    expect(campusReducer(used, { type: "useCoupon", id: "c", at })).toBe(used);
    expect(restoreState(JSON.stringify(used))).toEqual(used);
  });
  it("rejects corrupted balances, XP, duplicated stamps, invalid receipts and v1 storage", () => {
    const s = complete(verified(), "airport");
    for (const d of [
      { ...s, points: 99999 },
      { ...s, xp: 9999 },
      { ...s, completed: [...s.completed, ...s.completed] },
      { ...s, history: [] },
      { ...s, coupons: [{}] },
      { ...s, verifiedAt: null },
      { ...s, favorites: ["fake"] },
      { version: 1 },
      null,
    ])
      expect(restoreState(JSON.stringify(d))).toEqual(initialState());
    expect(restoreState("{")).toEqual(initialState());
    expect(restoreState(JSON.stringify(s))).toEqual(s);
  });
  it("persists favorites and settings, and resets the whole winter journey", () => {
    let s = verified();
    s = campusReducer(s, { type: "favorite", missionId: "seongsan" });
    s = campusReducer(s, { type: "notifications", enabled: false });
    s = campusReducer(s, { type: "clock", clock: "real" });
    expect(restoreState(JSON.stringify(s))).toEqual(s);
    expect(campusReducer(s, { type: "reset" })).toEqual(initialState());
  });
});
