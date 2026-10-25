import { describe, expect, it } from "vitest";
import { missions } from "../missions/catalog";
import { rewards } from "./catalog";
import { campusReducer, initialState } from "../../app/state/campus";

describe("demo reward availability", () => {
  it.each(rewards)(
    "allows earning enough points for $title from a fresh demo",
    (reward) => {
      const at = "2026-10-25T03:00:00Z";
      const state = missions.reduce(
        (state, mission) =>
          campusReducer(state, {
            type: "complete",
            missionId: mission.id,
            at,
            vote: "뷰티 · 향수",
          }),
        initialState(),
      );
      const result = campusReducer(state, {
        type: "exchange",
        rewardId: reward.id,
        id: reward.id,
        at,
      });
      expect(result.coupons).toHaveLength(1);
      expect(result.points).toBe(state.points - reward.points);
    },
  );
});
