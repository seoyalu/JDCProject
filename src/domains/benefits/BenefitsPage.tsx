import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Ticket,
  Wallet,
} from "lucide-react";
import { rewards } from "./catalog";
import type { Reward } from "./catalog";
import { useCampus } from "../../app/state/CampusContext";
import { date, number } from "../../shared/lib/format";
import { Empty } from "../../shared/ui/Empty";
import { Modal } from "../../shared/ui/Modal";
import { SectionTitle } from "../../shared/ui/SectionTitle";
import { PageHeading } from "../../shared/ui/PageHeading";
import s from "../../styles/App.module.css";

export function Benefits() {
  const { state, dispatch } = useCampus();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "wallet" ? "wallet" : "exchange";
  const [selected, setSelected] = useState<Reward | null>(null);
  const [issued, setIssued] = useState(false);
  const [using, setUsing] = useState<string | null>(null);
  const exchangeLock = useRef(false);
  const focusReward = params.get("reward");
  const available = state.coupons.filter(
    (c) => !c.usedAt && new Date(c.expiresAt) > new Date(),
  ).length;
  function exchange() {
    if (!selected || state.points < selected.points || exchangeLock.current)
      return;
    exchangeLock.current = true;
    dispatch({
      type: "exchange",
      rewardId: selected.id,
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
    });
    setSelected(null);
    setIssued(true);
  }
  return (
    <div className={s.page}>
      <PageHeading
        eyebrow="A GIFT FOR YOUR TODAY"
        title="즐긴 만큼 돌아오는 혜택"
        description="제주에서 쌓은 포인트를 나를 위한 선물로 바꿔보세요."
      />
      <div className={s.balanceBanner}>
        <span>
          <Wallet size={24} /> 교환 가능한 포인트
        </span>
        <strong>
          {number(state.points)}
          <small>P</small>
        </strong>
        <Link to="/missions">
          포인트 모으기 <ArrowRight size={16} />
        </Link>
      </div>
      <div className={s.tabBar}>
        <button
          className={tab === "exchange" ? s.activeTab : ""}
          onClick={() => setParams({})}
        >
          포인트 교환
        </button>
        <button
          className={tab === "wallet" ? s.activeTab : ""}
          onClick={() => setParams({ tab: "wallet" })}
        >
          내 쿠폰함 <span>{available}</span>
        </button>
      </div>
      {tab === "exchange" ? (
        <>
          <SectionTitle title="대학생 전용 쿠폰" />
          <div className={s.couponGrid}>
            {rewards.map((reward) => (
              <article
                key={reward.id}
                className={`${s.coupon} ${s[reward.theme]} ${focusReward === reward.id ? s.highlightCoupon : ""}`}
              >
                <div className={s.couponInner}>
                  <div className={s.couponBrand}>
                    JDC DUTY FREE <Ticket size={20} />
                  </div>
                  <h2>{reward.headline}</h2>
                  <h3>{reward.title}</h3>
                  <p>{reward.detail}</p>
                  <span className={s.couponValidity}>
                    발급일로부터 30일 · 체험용
                  </span>
                </div>
                <div className={s.couponBottom}>
                  <strong>{number(reward.points)}P</strong>
                  <button
                    disabled={state.points < reward.points}
                    onClick={() => {
                      exchangeLock.current = false;
                      setSelected(reward);
                    }}
                  >
                    {state.points < reward.points
                      ? `${number(reward.points - state.points)}P 더 필요`
                      : "교환하기"}
                    {state.points >= reward.points && <ArrowRight size={15} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className={s.infoBox}>
            <Ticket size={23} />
            <p>
              교환한 쿠폰은 <strong>내 쿠폰함</strong>에 보관돼요. 쿠폰 조건과
              포인트는 발표용 예시이며 실제 결제에는 사용할 수 없어요.
            </p>
          </div>
        </>
      ) : (
        <>
          {!state.coupons.length ? (
            <>
              <Empty title="첫 번째 혜택을 기다리고 있어요">
                모은 포인트로 쿠폰을 교환하면 이곳에 담아드려요.
              </Empty>
              <button
                className={s.secondaryButton}
                onClick={() => setParams({})}
              >
                교환할 쿠폰 둘러보기
              </button>
            </>
          ) : (
            <div className={s.walletList}>
              {state.coupons.map((c) => {
                const reward = rewards.find((r) => r.id === c.rewardId)!;
                const expired = new Date(c.expiresAt) <= new Date();
                return (
                  <article
                    key={c.id}
                    className={`${s.walletCoupon} ${c.usedAt || expired ? s.usedCoupon : ""}`}
                  >
                    <span className={`${s.statIcon} ${s[reward.theme]}`}>
                      <Ticket size={27} />
                    </span>
                    <div>
                      <span className={s.eyebrow}>JDC CAMPUS</span>
                      <h3>{reward.title}</h3>
                      <p>
                        {date(c.issuedAt)} 발급 · {date(c.expiresAt)}까지
                      </p>
                      <small>쿠폰 번호 {c.id.slice(0, 8).toUpperCase()}</small>
                    </div>
                    <button
                      className={s.walletUseButton}
                      disabled={!!c.usedAt || expired}
                      onClick={() => setUsing(c.id)}
                    >
                      {c.usedAt
                        ? "사용 완료"
                        : expired
                          ? "기간 만료"
                          : "사용 체험"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
          <p className={s.smallPrint}>
            데모 사용을 완료한 쿠폰은 사용 완료 상태로 보관돼요.
          </p>
        </>
      )}
      {selected && (
        <Modal title="쿠폰을 교환할까요?" onClose={() => setSelected(null)}>
          <div className={s.noticeIcon}>
            <Ticket size={32} />
          </div>
          <h3 className={s.centerText}>{selected.title}</h3>
          <div className={s.exchangeSummary}>
            <p>
              사용 포인트 <strong>−{number(selected.points)}P</strong>
            </p>
            <p>
              교환 후 잔액{" "}
              <strong>{number(state.points - selected.points)}P</strong>
            </p>
          </div>
          <p className={s.smallPrint}>
            발급일부터 30일간 유효한 체험용 쿠폰이에요.
          </p>
          <button
            className={s.primaryButton}
            onClick={exchange}
            disabled={state.points < selected.points}
          >
            {number(selected.points)}P로 교환하기
          </button>
        </Modal>
      )}
      {issued && (
        <Modal title="쿠폰이 도착했어요!" onClose={() => setIssued(false)}>
          <div className={s.noticeIcon}>
            <CheckCircle2 size={35} />
          </div>
          <p className={s.modalText}>
            제주에서 모은 즐거움이 혜택이 되었어요.
            <br />내 쿠폰함에서 새 쿠폰을 확인해 보세요.
          </p>
          <button
            className={s.primaryButton}
            onClick={() => {
              setIssued(false);
              setParams({ tab: "wallet" });
            }}
          >
            내 쿠폰함 열기 <ArrowRight size={18} />
          </button>
        </Modal>
      )}
      {using && (
        <Modal title="쿠폰 사용 체험" onClose={() => setUsing(null)}>
          <div className={s.noticeIcon}>
            <ShoppingBag size={32} />
          </div>
          <p className={s.modalText}>
            실제 서비스에서는 주문 또는 매장 결제 시 쿠폰을 적용해요. 아래
            버튼으로 사용 완료 상태를 체험할 수 있어요.
          </p>
          <button
            className={s.primaryButton}
            onClick={() => {
              dispatch({
                type: "useCoupon",
                id: using,
                at: new Date().toISOString(),
              });
              setUsing(null);
            }}
          >
            데모 사용 완료하기
          </button>
        </Modal>
      )}
    </div>
  );
}
