import { missions, voteOptions } from "../../domains/missions/catalog";
import { rewards } from "../../domains/benefits/catalog";

export const STORAGE_KEY = "jdc-campus-demo-v1";
const COUPON_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
const validDate = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value));
export interface Activity {
  id: string;
  label: string;
  points: number;
  at: string;
}
export interface OwnedCoupon {
  id: string;
  rewardId: string;
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
}
export interface CampusState {
  version: 1;
  points: number;
  completed: string[];
  votes: Record<string, string>;
  coupons: OwnedCoupon[];
  history: Activity[];
}
export type CampusAction =
  | { type: "complete"; missionId: string; at: string; vote?: string }
  | { type: "exchange"; rewardId: string; id: string; at: string }
  | { type: "useCoupon"; id: string; at: string }
  | { type: "reset" };

export function initialState(): CampusState {
  return {
    version: 1,
    points: 300,
    completed: [],
    votes: {},
    coupons: [],
    history: [
      {
        id: "welcome",
        label: "CAMPUS 웰컴 포인트",
        points: 300,
        at: "2026-10-25T09:00:00+09:00",
      },
    ],
  };
}

export function campusReducer(
  state: CampusState,
  action: CampusAction,
): CampusState {
  if (action.type === "reset") return initialState();
  if (!validDate(action.at)) return state;
  if (action.type === "complete") {
    const mission = missions.find((m) => m.id === action.missionId);
    if (!mission || state.completed.includes(mission.id)) return state;
    if (mission.kind === "vote" && !voteOptions.includes(action.vote ?? ""))
      return state;
    return {
      ...state,
      points: state.points + mission.points,
      completed: [...state.completed, mission.id],
      votes:
        mission.kind === "vote" && action.vote
          ? { ...state.votes, [mission.id]: action.vote }
          : state.votes,
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
    const expiresAt = expiry.toISOString();
    return {
      ...state,
      points: state.points - reward.points,
      coupons: [
        { id: action.id, rewardId: reward.id, issuedAt: action.at, expiresAt },
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
        c.id === action.id &&
        !c.usedAt &&
        new Date(c.expiresAt) > new Date(action.at)
          ? { ...c, usedAt: action.at }
          : c,
      ),
    };
  }
  return state;
}

export function restoreState(value: string | null): CampusState {
  if (!value) return initialState();
  try {
    const s: unknown = JSON.parse(value);
    if (!s || typeof s !== "object") return initialState();
    const d = s as CampusState;
    if (
      d.version !== 1 ||
      !Number.isSafeInteger(d.points) ||
      d.points < 0 ||
      !Array.isArray(d.completed) ||
      !d.completed.every((id) => missions.some((m) => m.id === id)) ||
      new Set(d.completed).size !== d.completed.length
    )
      return initialState();
    if (
      !d.votes ||
      typeof d.votes !== "object" ||
      Array.isArray(d.votes) ||
      !Object.values(d.votes).every((v) => typeof v === "string")
    )
      return initialState();
    if (
      !Array.isArray(d.coupons) ||
      !d.coupons.every(
        (c) =>
          c &&
          typeof c.id === "string" &&
          rewards.some((r) => r.id === c.rewardId) &&
          validDate(c.issuedAt) &&
          validDate(c.expiresAt) &&
          c.id.trim().length > 0 &&
          Date.parse(c.expiresAt) - Date.parse(c.issuedAt) ===
            COUPON_LIFETIME_MS &&
          (c.usedAt === undefined ||
            (validDate(c.usedAt) &&
              Date.parse(c.usedAt) >= Date.parse(c.issuedAt) &&
              Date.parse(c.usedAt) < Date.parse(c.expiresAt))),
      )
    )
      return initialState();
    if (
      !Array.isArray(d.history) ||
      !d.history.every(
        (h) =>
          h &&
          typeof h.id === "string" &&
          typeof h.label === "string" &&
          Number.isSafeInteger(h.points) &&
          validDate(h.at),
      )
    )
      return initialState();
    // Stored balances must agree with the mission and coupon ledger.
    if (new Set(d.coupons.map((c) => c.id)).size !== d.coupons.length)
      return initialState();
    const completedVotes = missions.filter(
      (m) => m.kind === "vote" && d.completed.includes(m.id),
    );
    if (
      Object.keys(d.votes).length !== completedVotes.length ||
      !completedVotes.every((m) => voteOptions.includes(d.votes[m.id]))
    )
      return initialState();
    const expected = new Map<string, number>([["welcome", 300]]);
    for (const id of d.completed)
      expected.set(`mission-${id}`, missions.find((m) => m.id === id)!.points);
    for (const coupon of d.coupons)
      expected.set(
        `exchange-${coupon.id}`,
        -rewards.find((r) => r.id === coupon.rewardId)!.points,
      );
    if (
      d.history.length !== expected.size ||
      new Set(d.history.map((h) => h.id)).size !== expected.size ||
      !d.history.every((h) => expected.get(h.id) === h.points) ||
      d.history.reduce((sum, h) => sum + h.points, 0) !== d.points
    )
      return initialState();
    return d;
  } catch {
    return initialState();
  }
}
