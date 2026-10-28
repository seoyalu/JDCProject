// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";
import { CampusProvider } from "./state/CampusContext";
import { campusReducer, initialState, STORAGE_KEY } from "./state/campus";
import { SEASON } from "../domains/missions/catalog";
function mount(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CampusProvider>
        <App />
      </CampusProvider>
    </MemoryRouter>,
  );
}
const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("winter campus screens", () => {
  it("issues the pass through explicit demo consent and completes a pre-trip mission", async () => {
    const user = userEvent.setup();
    mount("/verify");
    const submit = screen.getByRole("button", { name: /데모 인증하고 500P/ });
    expect((submit as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("checkbox"));
    await user.click(submit);
    expect(stored().points).toBe(500);
    await user.click(
      screen.getByRole("link", { name: /겨울방학 미션 만나보기/ }),
    );
    await user.click(
      screen.getByRole("link", { name: /나의 겨울 제주 버킷리스트/ }),
    );
    await user.click(
      screen.getByRole("button", { name: /미션 참여 시작하기/ }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: /성산일출봉에서 겨울 바다 보기/ }),
    );
    await user.click(
      screen.getByRole("button", { name: /계획 저장하고 100P/ }),
    );
    expect(stored().points).toBe(600);
    expect(stored().xp).toBe(50);
  });
  it("keeps onsite authentication locked until arrival", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        campusReducer(initialState(), {
          type: "verify",
          enrollment: "재학",
          at: SEASON.demoNow,
        }),
      ),
    );
    mount("/missions/seongsan");
    expect(
      (
        screen.getByRole("button", {
          name: "아직 참여할 수 없어요",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      screen.queryByRole("button", { name: "QR 인증 체험하기" }),
    ).toBeNull();
  });
  it("completes GPS arrival, restores state, and exchanges and uses a coupon", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        campusReducer(initialState(), {
          type: "verify",
          enrollment: "휴학",
          at: SEASON.demoNow,
        }),
      ),
    );
    mount("/missions/airport");
    await user.click(screen.getByRole("button", { name: "GPS 인증" }));
    await user.click(screen.getByRole("button", { name: "GPS 인증 체험하기" }));
    await user.click(
      screen.getByRole("button", { name: "데모 인증 완료하기" }),
    );
    expect(stored().points).toBe(1000);
    expect(stored().completed[0].method).toBe("gps");
    cleanup();
    mount("/benefits");
    const row = screen
      .getByRole("heading", { name: "JDC 면세점 10% 할인쿠폰" })
      .closest("article")!;
    await user.click(within(row).getByRole("button", { name: "교환하기" }));
    await user.click(screen.getByRole("button", { name: "500P로 교환하기" }));
    await user.click(screen.getByRole("button", { name: /내 쿠폰함 열기/ }));
    await user.click(screen.getByRole("button", { name: "사용 체험" }));
    await user.click(
      screen.getByRole("button", { name: "데모 사용 완료하기" }),
    );
    expect(stored().points).toBe(500);
    expect(stored().coupons[0].usedAt).toBeTruthy();
    cleanup();
    mount("/benefits?tab=wallet");
    expect(
      (screen.getByRole("button", { name: "사용 완료" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
  it("filters and searches the interactive map", async () => {
    const user = userEvent.setup();
    mount("/map");
    await user.type(
      screen.getByRole("textbox", { name: "지도 장소 검색" }),
      "성산",
    );
    expect(
      screen.getByRole("button", { name: "성산일출봉 · 잠금" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "제주국제공항 · 잠금" }),
    ).toBeNull();
    await user.click(screen.getByRole("button", { name: "성산일출봉 · 잠금" }));
    expect(screen.getByRole("heading", { name: "성산일출봉" })).toBeTruthy();
  });
  it("supports modal escape and focus restoration", async () => {
    const user = userEvent.setup();
    mount();
    const trigger = screen.getByRole("button", { name: "알림 보기" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it("shows fallback pages and remains usable when storage is blocked", () => {
    mount("/missions/airport/complete");
    expect(
      screen.getByRole("heading", {
        name: "이 페이지는 아직 제주 여행 중이에요",
      }),
    ).toBeTruthy();
    cleanup();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    mount("/missions");
    expect(screen.getByRole("status").textContent).toContain("저장 공간");
    expect(
      screen.getByRole("heading", { name: "나의 겨울방학 캠퍼스 미션" }),
    ).toBeTruthy();
  });
});
