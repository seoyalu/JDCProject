import { missions, voteOptions } from "../../domains/missions/catalog";
import { rewards } from "../../domains/benefits/catalog";

export const STORAGE_KEY = "jdc-campus-demo-v1";
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
  if (action.type === "complete") {
    const mission = missions.find((m) => m.id === action.missionId);
    if (!mission || state.completed.includes(mission.id)) return state;
    if (mission.kind === "vote" && !voteOptions.includes(action.vote ?? ""))
      return state;
    return {
      ...state,
      points: state.points + mission.points,
      completed: [...state.completed, mission.id],
      votes: action.vote
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
      state.points < reward.points ||
      state.coupons.some((c) => c.id === action.id)
    )
      return state;
    const expiresAt = new Date(
      new Date(action.at).getTime() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
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
    const validDate = (v: unknown) =>
      typeof v === "string" && Number.isFinite(Date.parse(v));
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
          (!c.usedAt || validDate(c.usedAt)),
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
    return d;
  } catch {
    return initialState();
  }
}
