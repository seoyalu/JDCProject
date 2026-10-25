import { describe, expect, it } from "vitest";
import { campusReducer, initialState, restoreState } from "./campus";

const at = "2026-10-25T03:00:00.000Z";
describe("CAMPUS reward flow", () => {
  it("earns a visit stamp and 200P exactly once, then exchanges 500P for a coupon", () => {
    const complete = { type: "complete" as const, missionId: "jdc-visit", at };
    const visited = campusReducer(initialState(), complete);
    expect(visited.points).toBe(500);
    expect(visited.completed).toEqual(["jdc-visit"]);
    expect(campusReducer(visited, complete)).toBe(visited);
    const exchange = {
      type: "exchange" as const,
      rewardId: "shipping",
      id: "coupon-1",
      at,
    };
    const result = campusReducer(visited, exchange);
    expect(result.points).toBe(0);
    expect(result.coupons).toHaveLength(1);
    expect(result.completed).toEqual(["jdc-visit"]);
    expect(result.history.map((h) => h.points)).toEqual([-500, 200, 300]);
    expect(campusReducer(result, exchange)).toBe(result);
  });
  it("does not issue coupons with insufficient points or unknown IDs", () => {
    const state = initialState();
    expect(
      campusReducer(state, {
        type: "exchange",
        rewardId: "shipping",
        id: "x",
        at,
      }),
    ).toBe(state);
    expect(
      campusReducer(state, { type: "exchange", rewardId: "fake", id: "x", at }),
    ).toBe(state);
    expect(
      campusReducer(state, { type: "complete", missionId: "fake", at }),
    ).toBe(state);
  });
  it("requires a valid vote and stores it with the earned reward", () => {
    const state = initialState();
    expect(
      campusReducer(state, { type: "complete", missionId: "brand-vote", at }),
    ).toBe(state);
    expect(
      campusReducer(state, {
        type: "complete",
        missionId: "brand-vote",
        vote: "invalid",
        at,
      }),
    ).toBe(state);
    const result = campusReducer(state, {
      type: "complete",
      missionId: "brand-vote",
      vote: "뷰티 · 향수",
      at,
    });
    expect(result.points).toBe(350);
    expect(result.votes["brand-vote"]).toBe("뷰티 · 향수");
  });
  it("retains a used coupon, and cannot use an expired coupon", () => {
    const issued = campusReducer(initialState(), {
      type: "exchange",
      rewardId: "discount5",
      id: "c",
      at,
    });
    const used = campusReducer(issued, { type: "useCoupon", id: "c", at });
    expect(used.coupons[0].usedAt).toBe(at);
    expect(used.points).toBe(0);
    const expired = campusReducer(issued, {
      type: "useCoupon",
      id: "c",
      at: "2027-01-01T00:00:00Z",
    });
    expect(expired.coupons[0].usedAt).toBeUndefined();
  });
  it("restores valid data and recovers safely from broken or outdated storage", () => {
    const state = campusReducer(initialState(), {
      type: "complete",
      missionId: "jdc-visit",
      at,
    });
    expect(restoreState(JSON.stringify(state))).toEqual(state);
    for (const invalid of [
      null,
      "",
      "{",
      "null",
      "{}",
      JSON.stringify({ ...state, points: -10 }),
      JSON.stringify({ ...state, coupons: [{}] }),
      JSON.stringify({ ...state, completed: ["jdc-visit", "jdc-visit"] }),
    ]) {
      expect(restoreState(invalid)).toEqual(initialState());
    }
    expect(campusReducer(state, { type: "reset" })).toEqual(initialState());
  });
});
