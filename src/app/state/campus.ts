import { missions, SEASON, validAnswer } from "../../domains/missions/catalog";
import type { AuthMethod, Mission } from "../../domains/missions/catalog";
import { rewards } from "../../domains/benefits/catalog";

export const STORAGE_KEY = "jdc-campus-demo-v2";
export const COUPON_LIFETIME_MS = 30 * 86400000;
const validDate = (v: unknown): v is string =>
  typeof v === "string" && Number.isFinite(Date.parse(v));
export interface Activity {
  id: string;
  label: string;
  points: number;
  at: string;
}
export interface Completion {
  missionId: string;
  at: string;
  method: AuthMethod;
  answer?: string;
}
export interface OwnedCoupon {
  id: string;
  rewardId: string;
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
}
export interface CampusState {
  version: 2;
  verifiedAt: string | null;
  enrollment: "재학" | "휴학";
  points: number;
  xp: number;
  started: string[];
  completed: Completion[];
  coupons: OwnedCoupon[];
  history: Activity[];
  favorites: string[];
  inviteClaimed: boolean;
  notifications: boolean;
  clock: "season" | "real";
}
export type CampusAction =
  | { type: "verify"; enrollment: "재학" | "휴학"; at: string }
  | { type: "start"; missionId: string; at: string }
  | {
      type: "complete";
      missionId: string;
      at: string;
      method: AuthMethod;
      answer?: string;
    }
  | { type: "exchange"; rewardId: string; id: string; at: string }
  | { type: "useCoupon"; id: string; at: string }
  | { type: "inviteSuccess"; at: string }
  | { type: "favorite"; missionId: string }
  | { type: "notifications"; enabled: boolean }
  | { type: "clock"; clock: "season" | "real" }
  | { type: "reset" };
export function initialState(): CampusState {
  return {
    version: 2,
    verifiedAt: null,
    enrollment: "재학",
    points: 0,
    xp: 0,
    started: [],
    completed: [],
    coupons: [],
    history: [],
    favorites: [],
    inviteClaimed: false,
    notifications: true,
    clock: "season",
  };
}
export function currentTime(state: CampusState) {
  return state.clock === "season" ? SEASON.demoNow : new Date().toISOString();
}
export function isVerified(state: CampusState, at: string) {
  return (
    !!state.verifiedAt &&
    Date.parse(at) >= Date.parse(state.verifiedAt) &&
    Date.parse(at) < Date.parse(state.verifiedAt) + 365 * 86400000
  );
}
export function hasCompleted(state: CampusState, id: string) {
  return state.completed.some((c) => c.missionId === id);
}
export function growth(xp: number) {
  const level = Math.min(5, Math.floor(xp / 300) + 1);
  return {
    level,
    title: [
      "여행 준비생",
      "제주 새내기",
      "제주 탐험가",
      "제주 길잡이",
      "제주 마스터",
    ][level - 1],
    progress: level === 5 ? 100 : Math.floor((xp % 300) / 3),
    remaining: level === 5 ? 0 : 300 - (xp % 300),
  };
}
export type MissionStatus =
  "예정" | "참여 가능" | "잠금" | "진행 중" | "완료" | "종료";
export function missionStatus(
  state: CampusState,
  mission: Mission,
  at = currentTime(state),
): MissionStatus {
  if (hasCompleted(state, mission.id)) return "완료";
  if (mission.seasonal && Date.parse(at) < Date.parse(SEASON.start))
    return "예정";
  if (mission.seasonal && Date.parse(at) >= Date.parse(SEASON.end))
    return "종료";
  if (
    !isVerified(state, at) ||
    (mission.prerequisite && !hasCompleted(state, mission.prerequisite))
  )
    return "잠금";
  return state.started.includes(mission.id) ? "진행 중" : "참여 가능";
}
export function lockReason(
  state: CampusState,
  mission: Mission,
  at = currentTime(state),
) {
  const status = missionStatus(state, mission, at);
  if (status === "예정") return "12월 20일, 겨울방학 시즌에 열려요";
  if (status === "종료") return "겨울방학 시즌이 종료되었어요";
  if (!isVerified(state, at)) return "대학생 인증 후 참여할 수 있어요";
  if (mission.prerequisite && !hasCompleted(state, mission.prerequisite))
    return mission.stage === "after"
      ? "제주 방문 기록을 먼저 남겨주세요"
      : "제주공항 도착 인증 후 참여 가능";
  return "";
}
export function campusReducer(
  state: CampusState,
  action: CampusAction,
): CampusState {
  if (action.type === "reset") return initialState();
  if (action.type === "clock") return { ...state, clock: action.clock };
  if (action.type === "notifications")
    return { ...state, notifications: action.enabled };
  if (action.type === "favorite") {
    if (!missions.some((m) => m.id === action.missionId)) return state;
    return {
      ...state,
      favorites: state.favorites.includes(action.missionId)
        ? state.favorites.filter((id) => id !== action.missionId)
        : [...state.favorites, action.missionId],
    };
  }
  if (!validDate(action.at)) return state;
  if (action.type === "verify") {
    if (state.verifiedAt || !["재학", "휴학"].includes(action.enrollment))
      return state;
    return {
      ...state,
      verifiedAt: action.at,
      enrollment: action.enrollment,
      points: state.points + 500,
      history: [
        {
          id: "verification",
          label: "대학생 인증 · CAMPUS PASS 발급",
          points: 500,
          at: action.at,
        },
        ...state.history,
      ],
    };
  }
  if (!isVerified(state, action.at) && action.type !== "useCoupon")
    return state;
  if (action.type === "start" || action.type === "complete") {
    const mission = missions.find((m) => m.id === action.missionId);
    if (!mission) return state;
    const status = missionStatus(state, mission, action.at);
    if (status !== "참여 가능" && status !== "진행 중") return state;
    if (action.type === "start")
      return state.started.includes(mission.id)
        ? state
        : { ...state, started: [...state.started, mission.id] };
    if (
      !state.started.includes(mission.id) ||
      !mission.methods.includes(action.method) ||
      !validAnswer(mission, action.answer)
    )
      return state;
    return {
      ...state,
      points: state.points + mission.points,
      xp: state.xp + mission.xp,
      started: state.started.filter((id) => id !== mission.id),
      completed: [
        ...state.completed,
        {
          missionId: mission.id,
          at: action.at,
          method: action.method,
          ...(action.answer !== undefined ? { answer: action.answer } : {}),
        },
      ],
      history: [
        {
          id: `mission-${mission.id}`,
          label: mission.title,
          points: mission.points,
          at: action.at,
        },
        ...state.history,
      ],
    };
  }
  if (action.type === "inviteSuccess") {
    if (state.inviteClaimed) return state;
    return {
      ...state,
      inviteClaimed: true,
      points: state.points + 300,
      history: [
        {
          id: "invite",
          label: "친구 초대 성공 체험",
          points: 300,
          at: action.at,
        },
        ...state.history,
      ],
    };
  }
  if (action.type === "exchange") {
    const reward = rewards.find((r) => r.id === action.rewardId);
    if (
      !reward ||
      !action.id.trim() ||
      state.points < reward.points ||
      state.coupons.some((c) => c.id === action.id)
    )
      return state;
    const expiry = new Date(Date.parse(action.at) + COUPON_LIFETIME_MS);
    if (!Number.isFinite(expiry.getTime())) return state;
    return {
      ...state,
      points: state.points - reward.points,
      coupons: [
        {
          id: action.id,
          rewardId: reward.id,
          issuedAt: action.at,
          expiresAt: expiry.toISOString(),
        },
        ...state.coupons,
      ],
      history: [
        {
          id: `exchange-${action.id}`,
          label: `${reward.title} 교환`,
          points: -reward.points,
          at: action.at,
        },
        ...state.history,
      ],
    };
  }
  if (action.type === "useCoupon") {
    const coupon = state.coupons.find((c) => c.id === action.id);
    if (
      !coupon ||
      coupon.usedAt ||
      Date.parse(action.at) < Date.parse(coupon.issuedAt) ||
      Date.parse(action.at) >= Date.parse(coupon.expiresAt)
    )
      return state;
    return {
      ...state,
      coupons: state.coupons.map((c) =>
        c.id === action.id ? { ...c, usedAt: action.at } : c,
      ),
    };
  }
  return state;
}
export function restoreState(value: string | null): CampusState {
  if (!value) return initialState();
  try {
    const d = JSON.parse(value) as CampusState;
    if (
      !d ||
      d.version !== 2 ||
      !["season", "real"].includes(d.clock) ||
      typeof d.notifications !== "boolean" ||
      typeof d.inviteClaimed !== "boolean" ||
      !["재학", "휴학"].includes(d.enrollment) ||
      (d.verifiedAt !== null && !validDate(d.verifiedAt))
    )
      return initialState();
    if (
      ![d.started, d.completed, d.coupons, d.history, d.favorites].every(
        Array.isArray,
      )
    )
      return initialState();
    if (
      !Number.isSafeInteger(d.points) ||
      d.points < 0 ||
      !Number.isSafeInteger(d.xp) ||
      d.xp < 0
    )
      return initialState();
    const validIds = (a: string[]) =>
      new Set(a).size === a.length &&
      a.every((id) => missions.some((m) => m.id === id));
    if (
      !validIds(d.started) ||
      !validIds(d.favorites) ||
      !validIds(d.completed.map((c) => c.missionId))
    )
      return initialState();
    if (d.started.some((id) => hasCompleted(d, id))) return initialState();
    let replay = initialState();
    if (d.verifiedAt)
      replay = campusReducer(replay, {
        type: "verify",
        enrollment: d.enrollment,
        at: d.verifiedAt,
      });
    for (const c of d.completed) {
      if (!c || !validDate(c.at)) return initialState();
      replay = campusReducer(replay, {
        type: "start",
        missionId: c.missionId,
        at: c.at,
      });
      replay = campusReducer(replay, { type: "complete", ...c });
      if (!hasCompleted(replay, c.missionId)) return initialState();
    }
    if (replay.xp !== d.xp || (d.inviteClaimed && !d.verifiedAt))
      return initialState();
    const expected = new Map<string, number>();
    if (d.verifiedAt) expected.set("verification", 500);
    if (d.inviteClaimed) expected.set("invite", 300);
    d.completed.forEach((c) =>
      expected.set(
        `mission-${c.missionId}`,
        missions.find((m) => m.id === c.missionId)!.points,
      ),
    );
    if (new Set(d.coupons.map((c) => c.id)).size !== d.coupons.length)
      return initialState();
    for (const c of d.coupons) {
      const reward = rewards.find((r) => r.id === c.rewardId);
      if (
        !reward ||
        typeof c.id !== "string" ||
        !c.id.trim() ||
        !validDate(c.issuedAt) ||
        !validDate(c.expiresAt) ||
        !isVerified(d, c.issuedAt) ||
        Date.parse(c.expiresAt) - Date.parse(c.issuedAt) !==
          COUPON_LIFETIME_MS ||
        (c.usedAt !== undefined &&
          (!validDate(c.usedAt) ||
            Date.parse(c.usedAt) < Date.parse(c.issuedAt) ||
            Date.parse(c.usedAt) >= Date.parse(c.expiresAt)))
      )
        return initialState();
      expected.set(`exchange-${c.id}`, -reward.points);
    }
    if (
      d.history.length !== expected.size ||
      new Set(d.history.map((h) => h.id)).size !== expected.size ||
      !d.history.every(
        (h) =>
          h &&
          validDate(h.at) &&
          typeof h.label === "string" &&
          expected.get(h.id) === h.points &&
          isVerified(d, h.at),
      ) ||
      d.history.reduce((sum, h) => sum + h.points, 0) !== d.points
    )
      return initialState();
    if (
      d.verifiedAt &&
      d.history.find((h) => h.id === "verification")?.at !== d.verifiedAt
    )
      return initialState();
    if (
      !d.completed.every(
        (c) =>
          d.history.find((h) => h.id === `mission-${c.missionId}`)?.at === c.at,
      ) ||
      !d.coupons.every(
        (c) =>
          d.history.find((h) => h.id === `exchange-${c.id}`)?.at === c.issuedAt,
      )
    )
      return initialState();
    let balance = 0;
    for (const h of [...d.history].reverse()) {
      balance += h.points;
      if (balance < 0) return initialState();
    }
    return d;
  } catch {
    return initialState();
  }
}
