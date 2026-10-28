import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Ticket,
  Snowflake,
} from "lucide-react";
import { rewards } from "./catalog";
import type { Reward } from "./catalog";
import { useCampus } from "../../app/state/CampusContext";
import { currentTime, isVerified } from "../../app/state/campus";
import { SEASON } from "../missions/catalog";
import { date, number } from "../../shared/lib/format";
import { PageHeading } from "../../shared/ui/PageHeading";
import { SectionTitle } from "../../shared/ui/SectionTitle";
import { Empty } from "../../shared/ui/Empty";
import { Modal } from "../../shared/ui/Modal";
import { Mong } from "../../shared/ui/Winter";
import s from "../../styles/App.module.css";
export function Benefits() {
  const { state, dispatch } = useCampus();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState<Reward | null>(null);
  const [issued, setIssued] = useState(false);
  const [using, setUsing] = useState<string | null>(null);
  const [filter, setFilter] = useState("전체");
  const lock = useRef(false);
  const wallet = params.get("tab") === "wallet";
  const now = currentTime(state);
  const verified = isVerified(state, now);
  const available = state.coupons.filter(
    (c) =>
      !c.usedAt &&
      Date.parse(c.expiresAt) > Date.parse(now) &&
      Date.parse(c.issuedAt) <= Date.parse(now),
  ).length;
  const visible = rewards;
  function exchange() {
    if (
      !selected ||
      lock.current ||
      !verified ||
      state.points < selected.points
    )
      return;
    lock.current = true;
    dispatch({
      type: "exchange",
      rewardId: selected.id,
      id: crypto.randomUUID(),
      at: now,
    });
    setSelected(null);
    setIssued(true);
  }
  function open(r: Reward) {
    lock.current = false;
    setSelected(r);
  }
  return (
    <div className={s.page}>
      <PageHeading
        eyebrow="A LITTLE GIFT FOR YOUR WINTER"
        title="CAMPUS 혜택"
        description="제주에서 쌓은 즐거움이 나를 위한 혜택으로 돌아와요."
      />
      <div className={s.balanceBanner}>
        <span>
          <b className={s.coin}>P</b>
          <span>
            내 포인트<strong>{number(state.points)}P</strong>
          </span>
        </span>
        <Link to="/my?tab=points">
          포인트 내역 <ArrowRight size={14} />
        </Link>
      </div>
      <div className={s.tabBar}>
        <button
          className={!wallet ? s.activeTab : ""}
          onClick={() => setParams({})}
        >
          포인트 교환
        </button>
        <button
          className={wallet ? s.activeTab : ""}
          onClick={() => setParams({ tab: "wallet" })}
        >
          내 쿠폰함 <span>{available}</span>
        </button>
      </div>
      {wallet ? (
        <>
          <CouponWallet onUse={setUsing} />
          <p className={s.smallPrint}>
            쿠폰의 유효기간은 발급일부터 30일입니다. 실제 결제에는 사용할 수
            없어요.
          </p>
        </>
      ) : (
        <>
          <section className={s.benefitHero}>
            <div>
              <span className={s.seasonTag}>겨울방학 한정 혜택</span>
              <h2>
                대학생의 겨울,
                <br />
                쇼핑도 <em>더 특별하게.</em>
              </h2>
              <p>대학생 전용 JDC 면세점 10% 할인쿠폰</p>
              <small>{SEASON.period}</small>
            </div>
            <Mong />
          </section>
          <SectionTitle title="추천 혜택" />
          <div className={s.recommendedRewards}>
            {rewards.slice(0, 2).map((r) => (
              <button key={r.id} onClick={() => open(r)}>
                <span className={r.id === "shipping" ? s.orange : s.blue}>
                  {r.id === "shipping" ? (
                    <Snowflake size={32} />
                  ) : (
                    <Ticket size={32} />
                  )}
                </span>
                <div>
                  <small>대학생 전용</small>
                  <strong>{r.title}</strong>
                  <b>
                    <i className={s.coin}>P</i> {r.points}P
                  </b>
                </div>
                <ArrowRight size={19} />
              </button>
            ))}
          </div>
          <div className={s.sectionGap}>
            <SectionTitle title="포인트로 교환하는 쿠폰" />
          </div>
          <div className={s.filterBar}>
            {["전체", "쿠폰", "포인트 교환"].map((f) => (
              <button
                key={f}
                className={filter === f ? s.selectedFilter : ""}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className={s.couponList}>
            {visible.map((r) => (
              <article key={r.id} className={s.couponRow}>
                <span className={`${s.couponSymbol} ${s[r.theme]}`}>
                  {r.id === "shipping" ? (
                    <Snowflake size={28} />
                  ) : (
                    <Ticket size={28} />
                  )}
                </span>
                <div>
                  <span className={s.studentLabel}>대학생 전용</span>
                  <h3>{r.title}</h3>
                  <p>{r.condition}</p>
                  <small>발급 후 30일 · 중복 할인 불가 · 체험용</small>
                  <b>
                    <i className={s.coin}>P</i> {r.points}P
                  </b>
                </div>
                <button
                  disabled={!verified || state.points < r.points}
                  onClick={() => open(r)}
                >
                  {!verified
                    ? "인증 필요"
                    : state.points < r.points
                      ? `${r.points - state.points}P 부족`
                      : "교환하기"}
                </button>
              </article>
            ))}
          </div>
          {!verified && (
            <Link className={s.secondaryButton} to="/verify">
              대학생 인증하고 500P 받기 <ArrowRight size={17} />
            </Link>
          )}
          <p className={s.smallPrint}>
            혜택·가격·사용 조건은 시연용 예시입니다. 교환한 쿠폰은 MY에서도
            확인할 수 있어요.
          </p>
        </>
      )}
      {selected && (
        <Modal title="쿠폰 교환 안내" onClose={() => setSelected(null)}>
          <div className={s.noticeIcon}>
            <Gift size={34} />
          </div>
          <h3>{selected.title}</h3>
          <p className={s.modalText}>
            {selected.condition}
            <br />
            발급일로부터 30일간 유효한 체험용 쿠폰입니다.
          </p>
          <div className={s.exchangeSummary}>
            <p>
              필요 포인트<strong>{selected.points}P</strong>
            </p>
            <p>
              보유 포인트<strong>{number(state.points)}P</strong>
            </p>
            {state.points >= selected.points && (
              <p>
                교환 후 잔액
                <strong>{number(state.points - selected.points)}P</strong>
              </p>
            )}
          </div>
          {!verified ? (
            <Link to="/verify" className={s.primaryButton}>
              대학생 인증하러 가기
            </Link>
          ) : (
            <button
              className={s.primaryButton}
              disabled={state.points < selected.points}
              onClick={exchange}
            >
              {state.points < selected.points
                ? `${selected.points - state.points}P가 더 필요해요`
                : `${selected.points}P로 교환하기`}
            </button>
          )}
        </Modal>
      )}
      {issued && (
        <Modal title="쿠폰이 도착했어요!" onClose={() => setIssued(false)}>
          <div className={s.noticeIcon}>
            <CheckCircle2 size={35} />
          </div>
          <p className={s.modalText}>
            활동으로 쌓은 포인트가 특별한 혜택이 되었어요.
          </p>
          <button
            className={s.primaryButton}
            onClick={() => {
              setIssued(false);
              setParams({ tab: "wallet" });
            }}
          >
            내 쿠폰함 열기 <ArrowRight size={17} />
          </button>
        </Modal>
      )}
      {using && (
        <Modal title="쿠폰 사용 체험" onClose={() => setUsing(null)}>
          <p className={s.modalText}>
            실제 서비스에서는 주문·결제 시 쿠폰을 적용해요. 지금은 사용 완료
            상태를 체험합니다.
          </p>
          <button
            className={s.primaryButton}
            onClick={() => {
              dispatch({ type: "useCoupon", id: using, at: now });
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
export function CouponWallet({ onUse }: { onUse: (id: string) => void }) {
  const { state } = useCampus();
  const now = Date.parse(currentTime(state));
  if (!state.coupons.length)
    return (
      <>
        <Empty title="아직 도착한 쿠폰이 없어요">
          모은 포인트로 나를 위한 혜택을 만나보세요.
        </Empty>
        <Link className={s.secondaryButton} to="/benefits">
          교환할 쿠폰 둘러보기
        </Link>
      </>
    );
  return (
    <div className={s.walletList}>
      {state.coupons.map((c) => {
        const r = rewards.find((r) => r.id === c.rewardId)!;
        const expired = Date.parse(c.expiresAt) <= now;
        const future = Date.parse(c.issuedAt) > now;
        return (
          <article
            className={`${s.walletCoupon} ${c.usedAt || expired ? s.usedCoupon : ""}`}
            key={c.id}
          >
            <span className={`${s.couponSymbol} ${s[r.theme]}`}>
              <Ticket size={27} />
            </span>
            <div>
              <span className={s.studentLabel}>대학생 전용 · 체험용</span>
              <h3>{r.title}</h3>
              <p>
                {date(c.issuedAt)} 발급 · {date(c.expiresAt)}까지
              </p>
              <small>{r.condition}</small>
            </div>
            <button
              disabled={!!c.usedAt || expired || future}
              onClick={() => onUse(c.id)}
            >
              {c.usedAt
                ? "사용 완료"
                : expired
                  ? "기간 만료"
                  : future
                    ? "발급일 이전"
                    : "사용 체험"}
            </button>
          </article>
        );
      })}
    </div>
  );
}
