import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Snowflake } from "lucide-react";
import { missions, SEASON } from "./catalog";
import { MissionCard } from "./MissionCard";
import { useCampus } from "../../app/state/CampusContext";
import { hasCompleted } from "../../app/state/campus";
import { PageHeading } from "../../shared/ui/PageHeading";
import { Empty } from "../../shared/ui/Empty";
import s from "../../styles/App.module.css";
export function Missions() {
  const [filter, setFilter] = useState("여행 전");
  const { state } = useCampus();
  const items = missions.filter(
    (m) =>
      filter === "전체" ||
      (filter === "여행 전" && m.stage === "before") ||
      (filter === "제주 현장" && m.stage === "onsite") ||
      (filter === "여행 후" && m.stage === "after") ||
      (filter === "완료" && hasCompleted(state, m.id)),
  );
  return (
    <div className={s.page}>
      <PageHeading
        eyebrow="WINTER CAMPUS MISSIONS"
        title="나의 겨울방학 캠퍼스 미션"
        description="제주를 꿈꾸는 순간부터 나만의 여행을 준비해요."
      />
      <div className={s.seasonNotice}>
        <Snowflake size={23} />
        <div>
          <strong>{SEASON.name}</strong>
          <p>{SEASON.period}</p>
        </div>
        <Link to="/map">
          지도로 탐험하기 <ArrowRight size={16} />
        </Link>
      </div>
      <div className={s.filterBar} aria-label="미션 단계 필터">
        {["여행 전", "제주 현장", "여행 후", "완료", "전체"].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            className={filter === f ? s.selectedFilter : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className={s.listMeta}>
        {filter} 미션 <strong>{items.length}</strong>
        <span>미션별 1회 참여</span>
      </div>
      <div className={s.missionPageGrid}>
        {items.map((m) => (
          <MissionCard key={m.id} mission={m} />
        ))}
      </div>
      {!items.length && (
        <Empty title="아직 기록된 미션이 없어요">
          여행 전 미션부터 시작해 보세요.
        </Empty>
      )}
    </div>
  );
}
