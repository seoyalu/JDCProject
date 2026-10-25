import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { missions } from "./catalog";
import { useCampus } from "../../app/state/CampusContext";
import { Empty } from "../../shared/ui/Empty";
import { MissionCard } from "./MissionCard";
import { PageHeading } from "../../shared/ui/PageHeading";
import s from "../../styles/App.module.css";

export function Missions() {
  const { state } = useCampus();
  const [filter, setFilter] = useState("전체");
  const items = missions.filter((m) =>
    filter === "완료"
      ? state.completed.includes(m.id)
      : filter === "진행 중"
        ? !state.completed.includes(m.id)
        : filter === "추천"
          ? m.recommended && !state.completed.includes(m.id)
          : true,
  );
  return (
    <div className={s.page}>
      <PageHeading
        eyebrow="EXPLORE JEJU"
        title="제주를 즐기는 작은 미션"
        description="새로운 경험 하나, 쌓이는 혜택 하나. 제디와 함께 시작해요."
      />
      <div className={s.missionPageBanner}>
        <span>
          오늘의 제주가
          <br />
          <strong>내일의 추억이 되도록.</strong>
        </span>
        <p>미션을 완료하고 포인트와 스탬프를 모아보세요.</p>
      </div>
      <div className={s.filterBar} aria-label="미션 필터">
        {["전체", "진행 중", "완료", "추천"].map((f) => (
          <button
            aria-pressed={filter === f}
            className={filter === f ? s.selectedFilter : ""}
            onClick={() => setFilter(f)}
            key={f}
          >
            {f}
            {f === "완료" && <small>{state.completed.length}</small>}
          </button>
        ))}
      </div>
      <div className={s.listMeta}>
        <span>
          {filter} 미션 <strong>{items.length}</strong>
        </span>
        <small>체험 기간 내 미션별 1회 참여</small>
      </div>
      <div className={s.missionPageGrid}>
        {items.map((m) => (
          <MissionCard key={m.id} mission={m} />
        ))}
      </div>
      {!items.length && (
        <Empty
          title={
            filter === "완료"
              ? "첫 번째 추억을 기다리고 있어요"
              : "이곳의 미션을 모두 만나봤어요"
          }
        >
          {filter === "완료"
            ? "미션에 참여하면 완료한 활동이 이곳에 모여요."
            : "전체 탭에서 다른 미션을 살펴보세요."}
        </Empty>
      )}
      <div className={s.infoBox}>
        <ShieldCheck size={21} />
        <p>
          이곳은 발표용 체험 공간이에요. 현장 방문 대신{" "}
          <strong>데모 인증</strong>으로 미션 흐름을 경험할 수 있어요.
        </p>
      </div>
    </div>
  );
}
