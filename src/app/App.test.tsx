import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";
import { CampusProvider } from "./state/CampusContext";
import { STORAGE_KEY } from "./state/campus";
// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";

function mount(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CampusProvider>
        <App />
      </CampusProvider>
    </MemoryRouter>,
  );
}
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("campus screen flows", () => {
  it("completes a visit, exchanges a coupon, uses it, and restores it after remount", async () => {
    const user = userEvent.setup();
    mount("/missions/jdc-visit");
    await user.click(
      screen.getByRole("button", { name: /방문 인증 시작하기/ }),
    );
    await user.click(screen.getByRole("button", { name: /데모 인증하기/ }));
    expect(
      screen.getByRole("heading", { name: "제주와 한 걸음 더 가까워졌어요!" }),
    ).toBeTruthy();
    await user.click(
      screen.getByRole("link", { name: /포인트로 혜택 만나기/ }),
    );
    const coupon = screen
      .getByRole("heading", { name: "무료배송 쿠폰" })
      .closest("article")!;
    await user.click(within(coupon).getByRole("button", { name: /교환하기/ }));
    await user.click(screen.getByRole("button", { name: "500P로 교환하기" }));
    await user.click(screen.getByRole("button", { name: /내 쿠폰함 열기/ }));
    await user.click(screen.getByRole("button", { name: "사용 체험" }));
    await user.click(
      screen.getByRole("button", { name: "데모 사용 완료하기" }),
    );
    expect(
      (screen.getByRole("button", { name: "사용 완료" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).points).toBe(0);
    cleanup();
    mount("/benefits?tab=wallet");
    expect(screen.getByRole("button", { name: "사용 완료" })).toBeTruthy();
  });
  it("requires a vote selection and saves the chosen option", async () => {
    const user = userEvent.setup();
    mount("/missions/brand-vote");
    const submit = screen.getByRole("button", { name: /투표하고 포인트 받기/ });
    expect((submit as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("radio", { name: "뷰티 · 향수" }));
    await user.click(submit);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).votes["brand-vote"],
    ).toBe("뷰티 · 향수");
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
  it("shows a fallback for unknown routes and incomplete mission result URLs", () => {
    mount("/missions/jdc-visit/complete");
    expect(
      screen.getByRole("heading", {
        name: "이 페이지는 아직 제주 여행 중이에요",
      }),
    ).toBeTruthy();
    cleanup();
    mount("/missing");
    expect(
      screen.getByRole("heading", {
        name: "이 페이지는 아직 제주 여행 중이에요",
      }),
    ).toBeTruthy();
  });
  it("keeps the app usable when browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    mount("/missions");
    expect(screen.getByRole("status").textContent).toContain("저장 공간");
    expect(
      screen.getByRole("heading", { name: "제주를 즐기는 작은 미션" }),
    ).toBeTruthy();
  });
});
