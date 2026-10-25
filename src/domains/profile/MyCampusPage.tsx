import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Ticket } from "lucide-react";
import { Wallet } from "lucide-react";
import { Waves } from "lucide-react";
import { missions } from "../missions/catalog";
import { useCampus } from "../../app/state/CampusContext";
import { date } from "../../shared/lib/format";
import { Empty } from "../../shared/ui/Empty";
import { MissionCard } from "../missions/MissionCard";
import { Modal } from "../../shared/ui/Modal";
import { number } from "../../shared/lib/format";
import { PageHeading } from "../../shared/ui/PageHeading";
import s from "../../styles/App.module.css";

export function MyCampus() {
  const { state, dispatch } = useCampus();
  const [params, setParams] = useSearchParams();
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();
  const tab = params.get("tab") === "points" ? "points" : "activity";
  const positive = state.history
    .filter((h) => h.points > 0)
    .reduce((sum, h) => sum + h.points, 0);
  return (
    <div className={s.page}>
      <PageHeading
        eyebrow="MY CAMPUS"
        title="제디님의 제주 이야기"
        description="즐겁게 참여한 순간과 나에게 돌아온 혜택을 한곳에서."
      />
      <div className={s.profileCard}>
        <span className={s.profileAvatar}>
          <Waves size={34} />
        </span>
        <div>
          <h2>
            김제디 <span>새내기</span>
          </h2>
          <p>
            제주대학교 <ShieldCheck size={15} />
          </p>
        </div>
        <Link to="/pass" className={s.textLink}>
          PASS 보기 <ChevronRight size={16} />
        </Link>
      </div>
      <div className={s.myStats}>
        <div>
          <span>보유 포인트</span>
          <strong>{number(state.points)}P</strong>
        </div>
        <div>
          <span>누적 적립</span>
          <strong>{number(positive)}P</strong>
        </div>
        <div>
          <span>완료한 미션</span>
          <strong>{state.completed.length}개</strong>
        </div>
      </div>
      <div className={s.tabBar}>
        <button
          className={tab === "activity" ? s.activeTab : ""}
          onClick={() => setParams({})}
        >
          내 활동
        </button>
        <button
          className={tab === "points" ? s.activeTab : ""}
          onClick={() => setParams({ tab: "points" })}
        >
          포인트 내역
        </button>
      </div>
      {tab === "activity" ? (
        <>
          {state.completed.length ? (
            <div className={s.missionList}>
              {missions
                .filter((m) => state.completed.includes(m.id))
                .map((m) => (
                  <MissionCard key={m.id} mission={m} />
                ))}
            </div>
          ) : (
            <Empty title="제주 이야기의 첫 페이지">
              오늘의 미션에 참여하고 나만의 기록을 남겨보세요.
            </Empty>
          )}
          <Link to="/missions" className={s.secondaryButton}>
            미션 둘러보기 <ArrowRight size={17} />
          </Link>
        </>
      ) : (
        <div className={s.history}>
          {state.history.map((h) => (
            <div className={s.historyItem} key={h.id}>
              <span
                className={`${s.statIcon} ${h.points > 0 ? s.blue : s.orange}`}
              >
                {h.points > 0 ? <Wallet size={21} /> : <Ticket size={21} />}
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
      )}
      <div className={s.demoSettings}>
        <div>
          <h3>처음부터 다시 만나고 싶다면</h3>
          <p>이 브라우저의 체험 기록을 지우고 300P로 다시 시작해요.</p>
        </div>
        <button onClick={() => setReset(true)}>
          <RotateCcw size={16} /> 체험 초기화
        </button>
      </div>
      {reset && (
        <Modal
          title="체험을 처음부터 시작할까요?"
          onClose={() => setReset(false)}
        >
          <p className={s.modalText}>
            이 브라우저의 미션, 스탬프, 쿠폰, 포인트 내역이 초기화되고 웰컴
            포인트 300P로 돌아갑니다.
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
    </div>
  );
}
