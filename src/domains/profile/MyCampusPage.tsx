import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  FileText,
  Heart,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import { useCampus } from "../../app/state/CampusContext";
import { currentTime, growth, isVerified } from "../../app/state/campus";
import { missions } from "../missions/catalog";
import { MissionCard } from "../missions/MissionCard";
import { Modal } from "../../shared/ui/Modal";
import { Empty } from "../../shared/ui/Empty";
import { GrowthCard, Mong } from "../../shared/ui/Winter";
import { PageHeading } from "../../shared/ui/PageHeading";
import { date, number } from "../../shared/lib/format";
import s from "../../styles/App.module.css";
export function MyCampus() {
  const { state, dispatch } = useCampus();
  const [params, setParams] = useSearchParams();
  const [reset, setReset] = useState(false);
  const [invite, setInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const tab = params.get("tab") ?? "activity";
  const now = currentTime(state);
  const verified = isVerified(state, now);
  const g = growth(state.xp);
  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/?invite=JEDI-WINTER`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className={s.page}>
      <div className={s.myHeading}>
        <PageHeading
          eyebrow="MY WINTER CAMPUS"
          title="MY"
          description="해녀몽이와 함께 쌓은 나만의 겨울 제주 이야기"
        />
        <button
          className={s.iconButton}
          aria-label="체험 설정 열기"
          onClick={() => setParams({ tab: "settings" })}
        >
          <Settings size={22} />
        </button>
      </div>
      <div className={s.profileCard}>
        <span className={s.profileAvatar}>
          <Mong alt="김제디 프로필" />
        </span>
        <div>
          <h2>김제디</h2>
          <p>제주대학교</p>
          <span className={verified ? s.verified : s.unverified}>
            <CheckCircle2 size={13} />
            {verified ? "대학생 인증 완료" : "대학생 인증 전"}
          </span>
        </div>
        <Link to={verified ? "/pass" : "/verify"}>
          {verified ? "CAMPUS PASS" : "인증하기"}
          <ChevronRight size={13} />
        </Link>
      </div>
      <div className={s.myStats}>
        <Link to="/my?tab=points">
          <strong>{number(state.points)}P</strong>
          <span>보유 포인트</span>
        </Link>
        <Link to="/map">
          <strong>{state.completed.length}</strong>
          <span>스탬프</span>
        </Link>
        <Link to="/my?tab=growth">
          <strong>LV.{g.level}</strong>
          <span>{g.title}</span>
        </Link>
      </div>
      <div className={s.myColumns}>
        <div>
          <h2 className={s.subheading}>해녀몽이 성장 기록</h2>
          <GrowthCard />
          <div className={s.quickLinks}>
            <Link to="/my?tab=activity">
              <FileText />
              <span>내 활동 기록</span>
            </Link>
            <Link to="/benefits?tab=wallet">
              <Ticket />
              <span>보유 쿠폰</span>
            </Link>
            <Link to="/my?tab=points">
              <Wallet />
              <span>포인트 내역</span>
            </Link>
            <Link to="/my?tab=favorites">
              <Heart />
              <span>관심 미션</span>
            </Link>
          </div>
          <div className={s.profileMenu}>
            <Link to="/pass">
              <ShieldCheck />
              대학생 인증 관리
              <ChevronRight />
            </Link>
            <button onClick={() => setInvite(true)}>
              <Users />
              친구 초대하고 포인트 받기 <b>+300P</b>
              <ChevronRight />
            </button>
            <button onClick={() => setParams({ tab: "settings" })}>
              <Bell />
              알림 및 체험 설정
              <ChevronRight />
            </button>
            <button onClick={() => setParams({ tab: "guide" })}>
              <CircleHelp />
              이용 안내 · 자주 묻는 질문
              <ChevronRight />
            </button>
          </div>
        </div>
        <section className={s.myContent}>
          <div className={s.tabBar}>
            {[
              { id: "activity", label: "활동 기록" },
              { id: "points", label: "포인트" },
              { id: "growth", label: "성장" },
              { id: "favorites", label: "관심" },
            ].map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? s.activeTab : ""}
                onClick={() => setParams({ tab: t.id })}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === "activity" && (
            <>
              {state.completed.length ? (
                <div className={s.activityList}>
                  {[...state.completed].reverse().map((c) => {
                    const m = missions.find((m) => m.id === c.missionId)!;
                    return (
                      <Link
                        key={c.missionId}
                        to={
                          m.position
                            ? `/map?place=${m.id}`
                            : `/missions/${m.id}`
                        }
                      >
                        <span className={s.activityStamp}>
                          <Mong alt="완료 스탬프" />
                        </span>
                        <div>
                          <h3>{m.title}</h3>
                          <p>
                            {date(c.at)} ·{" "}
                            {m.stage === "onsite" ? "현장 방문" : "미션 완료"}
                          </p>
                        </div>
                        <b>+{m.points}P</b>
                        <ChevronRight size={15} />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Empty title="우리의 첫 여행을 기다려요">
                  여행 전 미션으로 첫 기록을 남겨보세요.
                </Empty>
              )}
              <Link to="/missions" className={s.secondaryButton}>
                시즌 미션 만나보기 <ArrowRight size={16} />
              </Link>
            </>
          )}
          {tab === "points" && (
            <>
              {state.history.length ? (
                <div className={s.history}>
                  {state.history.map((h) => (
                    <div className={s.historyItem} key={h.id}>
                      <span className={s.historyIcon}>
                        {h.points > 0 ? (
                          <Wallet size={19} />
                        ) : (
                          <Ticket size={19} />
                        )}
                      </span>
                      <div>
                        <strong>{h.label}</strong>
                        <small>{date(h.at)}</small>
                      </div>
                      <b className={h.points > 0 ? s.positive : s.negative}>
                        {h.points > 0 ? "+" : ""}
                        {number(h.points)}P
                      </b>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty title="포인트 내역이 아직 없어요">
                  대학생 인증으로 500P부터 시작해 보세요.
                </Empty>
              )}
            </>
          )}
          {tab === "growth" && (
            <div className={s.growthDetail}>
              <Mong />
              <h2>
                LV.{g.level} {g.title}
              </h2>
              <p>지금까지 {state.xp}XP를 모았어요.</p>
              <span className={s.progress}>
                <i style={{ width: `${g.progress}%` }} />
              </span>
              <strong>
                {g.remaining
                  ? `다음 레벨까지 ${g.remaining}XP`
                  : "최고 레벨을 달성했어요!"}
              </strong>
              <p>
                경험치 300XP마다 한 단계 성장해요.
                <br />
                포인트를 사용해도 경험치와 스탬프는 남아요.
              </p>
              <div className={s.levelSteps}>
                {["준비생", "새내기", "탐험가", "길잡이", "마스터"].map(
                  (v, i) => (
                    <span key={v} className={i < g.level ? s.earnedLevel : ""}>
                      <Sparkles size={16} />
                      <b>LV.{i + 1}</b>
                      {v}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}
          {tab === "favorites" && (
            <div className={s.missionList}>
              {state.favorites.length ? (
                missions
                  .filter((m) => state.favorites.includes(m.id))
                  .map((m) => <MissionCard key={m.id} mission={m} />)
              ) : (
                <Empty title="마음에 드는 제주를 담아보세요">
                  미션 상세의 하트 버튼으로 관심 미션을 저장해요.
                </Empty>
              )}
            </div>
          )}
          {tab === "settings" && (
            <div className={s.settings}>
              <h2>알림 및 체험 설정</h2>
              <label className={s.switchRow}>
                <span>
                  시즌 소식 알림
                  <small>이 브라우저에만 저장되는 알림 표시 설정</small>
                </span>
                <input
                  type="checkbox"
                  checked={state.notifications}
                  onChange={(e) =>
                    dispatch({
                      type: "notifications",
                      enabled: e.target.checked,
                    })
                  }
                />
              </label>
              <label className={s.switchRow}>
                <span>
                  겨울방학 체험 모드
                  <small>2027.01.05로 시즌 미션을 미리 체험해요.</small>
                </span>
                <input
                  type="checkbox"
                  checked={state.clock === "season"}
                  onChange={(e) =>
                    dispatch({
                      type: "clock",
                      clock: e.target.checked ? "season" : "real",
                    })
                  }
                />
              </label>
              <p>
                모드를 끄면 실제 날짜에 따라 시즌 시작 전에는 예정, 시즌이
                끝나면 종료로 표시돼요. 완료 기록은 유지됩니다.
              </p>
              <button
                className={s.secondaryButton}
                onClick={() => setReset(true)}
              >
                <RotateCcw size={16} />
                체험 초기화
              </button>
            </div>
          )}
          {tab === "guide" && (
            <div className={s.guide}>
              <h2>처음 만나는 CAMPUS</h2>
              {[
                [
                  "어떤 순서로 체험하나요?",
                  "대학생 인증 → 여행 전 미션 → 공항 도착 인증 → 지도 탐험 → 쿠폰 교환 순서로 즐겨보세요.",
                ],
                [
                  "실제 학생증이나 위치가 필요한가요?",
                  "이 발표용 서비스는 김제디 가상 계정과 QR·GPS 데모 인증을 사용합니다. 학생증과 실제 위치는 수집하지 않아요.",
                ],
                [
                  "포인트와 경험치는 어떻게 다른가요?",
                  "포인트는 쿠폰 교환 시 차감됩니다. 경험치는 해녀몽이 성장에 사용되고, 스탬프와 함께 계속 남아요.",
                ],
                [
                  "친구 초대 보상은 언제 받나요?",
                  "실제 운영에서는 친구의 인증 완료 등 성공 조건을 검증한 뒤 지급합니다. 여기서는 초대 성공 체험 버튼으로 1회 300P를 받아요.",
                ],
                [
                  "기기를 바꾸면 기록이 유지되나요?",
                  "기록은 현재 브라우저에만 저장되며 다른 기기와 공유되지 않습니다.",
                ],
                [
                  "현장 미션이 왜 잠겨 있나요?",
                  "대학생 인증 후 제주공항 도착 인증을 완료하면 현장 미션이 열립니다. 시즌 미션은 참여 기간도 충족해야 해요.",
                ],
              ].map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          )}
          {![
            "activity",
            "points",
            "growth",
            "favorites",
            "settings",
            "guide",
          ].includes(tab) && (
            <Empty title="메뉴를 선택해 주세요">
              위 탭에서 나의 기록을 확인할 수 있어요.
            </Empty>
          )}
        </section>
      </div>
      <div className={s.demoSettings}>
        <Clock3 size={16} />
        <span>다시 체험하고 싶다면 0P부터 시작할 수 있어요.</span>
        <button onClick={() => setReset(true)}>
          <RotateCcw size={14} />
          체험 초기화
        </button>
      </div>
      {reset && (
        <Modal
          title="겨울 여행을 처음부터 시작할까요?"
          onClose={() => setReset(false)}
        >
          <p className={s.modalText}>
            이 브라우저의 인증, 미션, 쿠폰, 포인트와 성장 기록을 지우고 인증 전
            0P 상태로 돌아갑니다.
          </p>
          <button
            className={s.primaryButton}
            onClick={() => {
              dispatch({ type: "reset" });
              setReset(false);
              navigate("/");
            }}
          >
            초기화하고 홈으로
          </button>
          <button className={s.secondaryButton} onClick={() => setReset(false)}>
            계속 체험하기
          </button>
        </Modal>
      )}
      {invite && (
        <Modal
          title="친구와 함께하는 겨울 제주"
          onClose={() => setInvite(false)}
        >
          <Mong className={s.modalMong} />
          <h3>설렘은 나누면 더 커지니까!</h3>
          <p className={s.modalText}>
            초대 코드 <strong>JEDI-WINTER</strong>
            <br />
            친구의 대학생 인증 완료 시 300P를 받는 상황을 체험해요.
          </p>
          <button className={s.secondaryButton} onClick={copyInvite}>
            <Copy size={16} />
            {copied ? "초대 링크 복사 완료" : "초대 링크 복사"}
          </button>
          <p className={s.smallPrint}>
            외부 메시지는 보내지 않습니다. 실제 추천인 추적은 연동되지 않았어요.
          </p>
          {!verified ? (
            <Link className={s.primaryButton} to="/verify">
              먼저 대학생 인증하기
            </Link>
          ) : (
            <button
              className={s.primaryButton}
              disabled={state.inviteClaimed}
              onClick={() => dispatch({ type: "inviteSuccess", at: now })}
            >
              {state.inviteClaimed
                ? "초대 보상 300P 수령 완료"
                : "초대 성공 체험하고 300P 받기"}
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}
