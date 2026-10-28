import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, LockKeyhole } from "lucide-react";
import type { Mission } from "./catalog";
import { MissionIcon } from "./MissionIcon";
import { useCampus } from "../../app/state/CampusContext";
import { lockReason, missionStatus } from "../../app/state/campus";
import s from "../../styles/App.module.css";
export function MissionCard({ mission }: { mission: Mission }) {
  const { state } = useCampus();
  const status = missionStatus(state, mission);
  const locked = ["잠금", "예정", "종료"].includes(status);
  return (
    <Link
      to={`/missions/${mission.id}`}
      className={`${s.missionCard} ${locked ? s.lockedCard : ""}`}
    >
      <span className={`${s.missionIcon} ${s[mission.kind]}`}>
        <MissionIcon kind={mission.kind} />
      </span>
      <div className={s.missionBody}>
        <h3>{mission.title}</h3>
        <p>{locked ? lockReason(state, mission) : mission.short}</p>
        <div className={s.cardTags}>
          <span className={mission.seasonal ? s.seasonTag : s.alwaysTag}>
            {mission.seasonal ? "겨울방학 한정" : "상시"}
          </span>
          <span className={s.rewardPill}>+{mission.points}P</span>
          {status === "진행 중" && (
            <span className={s.inProgressTag}>진행 중</span>
          )}
        </div>
      </div>
      {status === "완료" ? (
        <CheckCircle2 className={s.doneIcon} size={21} />
      ) : locked ? (
        <LockKeyhole className={s.lockIcon} size={18} />
      ) : (
        <ChevronRight className={s.cardArrow} size={19} />
      )}
    </Link>
  );
}
