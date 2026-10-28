import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Map,
  Sparkles,
  Stamp,
} from "lucide-react";
import { missions } from "./catalog";
import { useCampus } from "../../app/state/CampusContext";
import { growth } from "../../app/state/campus";
import { Mong } from "../../shared/ui/Winter";
import { NotFound } from "../../shared/ui/NotFound";
import { date, number } from "../../shared/lib/format";
import s from "../../styles/App.module.css";
export function MissionComplete() {
  const { id } = useParams();
  const { state } = useCampus();
  const [copied, setCopied] = useState(false);
  const mission = missions.find((m) => m.id === id);
  const record = state.completed.find((c) => c.missionId === id);
  if (!mission || !record) return <NotFound />;
  const g = growth(state.xp);
  const summary = `나의 겨울 제주 이야기: ${record.answer ?? mission.title} · ${state.completed.length}개 미션 완료 · 해녀몽이 LV.${g.level}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className={s.successPage}>
      <div className={s.successArt}>
        <Mong />
        <span>✦</span>
        <i>
          <CheckCircle2 size={29} />
        </i>
      </div>
      <span className={s.eyebrow}>ONE MORE WINTER MEMORY</span>
      <h1>
        {mission.stage === "onsite"
          ? "해녀몽이가 이곳을 다녀왔어요!"
          : "우리의 제주가 조금 더 가까워졌어요!"}
      </h1>
      <p>
        {mission.title}
        <br />
        <small>{date(record.at)} 완료</small>
      </p>
      <strong className={s.earnedPoints}>
        +{mission.points}
        <small>P</small>
      </strong>
      <div className={s.successRewards}>
        <div>
          <Stamp size={23} />
          <span>
            {mission.stamp}
            <small>스탬프 1개 획득</small>
          </span>
        </div>
        <div>
          <Sparkles size={23} />
          <span>
            +{mission.xp}XP
            <small>
              LV.{g.level} {g.title}
            </small>
          </span>
        </div>
      </div>
      {mission.id === "airport" && (
        <div className={s.unlockNotice}>
          제주 현장 미션이 열렸어요!
          <br />
          <small>지도에서 다음 여행지를 선택해 보세요.</small>
        </div>
      )}
      <div className={s.balanceLine}>
        현재 보유 포인트<strong>{number(state.points)}P</strong>
      </div>
      <Link
        className={s.primaryButton}
        to={mission.stage === "before" ? "/map" : `/map?place=${mission.id}`}
      >
        <Map size={18} />
        {mission.stage === "before"
          ? "제주에 가면 열리는 미션 보기"
          : "지도에서 내 발자국 보기"}
        <ArrowRight size={17} />
      </Link>
      <Link className={s.secondaryButton} to="/benefits">
        포인트로 JDC 혜택 만나기
      </Link>
      {mission.kind === "share" && (
        <div className={s.shareSummary}>
          <p>{summary}</p>
          <button className={s.secondaryButton} onClick={copy}>
            <Copy size={16} />
            {copied ? "공유 문구를 복사했어요" : "공유 문구 복사"}
          </button>
          <small>복사가 안 되면 위 문구를 선택해서 복사해 주세요.</small>
        </div>
      )}
      <Link className={s.textLink} to="/missions">
        다른 시즌 미션 둘러보기 <ArrowRight size={14} />
      </Link>
    </div>
  );
}
