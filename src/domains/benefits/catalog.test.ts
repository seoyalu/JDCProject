import { describe, expect, it } from "vitest";
import { rewards } from "./catalog";
import { campusReducer, initialState } from "../../app/state/campus";
import { SEASON } from "../missions/catalog";
describe("demo reward accessibility", () => {
  it.each(rewards)("allows $title after student verification", (r) => {
    const at = SEASON.demoNow;
    const s = campusReducer(initialState(), {
      type: "verify",
      enrollment: "휴학",
      at,
    });
    const result = campusReducer(s, {
      type: "exchange",
      rewardId: r.id,
      id: r.id,
      at,
    });
    expect(result.coupons).toHaveLength(1);
    expect(result.points).toBe(500 - r.points);
  });
});
