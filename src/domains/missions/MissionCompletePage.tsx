import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, ChevronRight, Stamp } from "lucide-react";
import { missions } from "./catalog";
import { useCampus } from "../../app/state/CampusContext";
import { MissionIcon } from "./MissionIcon";
import { number } from "../../shared/lib/format";
import { NotFound } from "../../shared/ui/NotFound";
import s from "../../styles/App.module.css";

export function MissionComplete() {
  const { id } = useParams();
  const { state } = useCampus();
  const mission = missions.find((m) => m.id === id);
  if (!mission || !state.completed.includes(mission.id)) return <NotFound />;
  return (
    <div className={s.successPage}>
      <div className={s.successArtwork}>
        <div className={s.successSeal}>
          <Check size={49} />
        </div>
        <span className={s.confettiOne}>✦</span>
        <span className={s.confettiTwo}>✦</span>
        <span className={s.confettiThree}>●</span>
      </div>
      <span className={s.eyebrow}>A LITTLE ADVENTURE, A BIG SMILE</span>
      <h1>제주와 한 걸음 더 가까워졌어요!</h1>
      <p>{mission.title} 미션을 완료했어요.</p>
      <div className={s.earnedPoints}>
        +{mission.points}
        <span>P</span>
      </div>
      <div className={s.newStamp}>
        <span className={`${s.missionIcon} ${s[mission.kind]}`}>
          <MissionIcon kind={mission.kind} />
        </span>
        <div>
          <small>새로운 스탬프 획득</small>
          <strong>{mission.stamp}</strong>
        </div>
        <Stamp size={24} />
      </div>
      <div className={s.balanceLine}>
        현재 보유 포인트 <strong>{number(state.points)}P</strong>
      </div>
      <Link className={s.primaryButton} to="/benefits">
        포인트로 혜택 만나기 <ArrowRight size={18} />
      </Link>
      <Link className={s.secondaryButton} to="/pass">
        나의 PASS와 스탬프 보기
      </Link>
      <Link className={s.textLink} to="/missions">
        다른 미션 둘러보기 <ChevronRight size={15} />
      </Link>
    </div>
  );
}
