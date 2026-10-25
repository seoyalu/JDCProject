import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { useCampus } from "../../app/state/CampusContext";
import { MissionIcon } from "./MissionIcon";
import type { Mission } from "./catalog";
import s from "../../styles/App.module.css";

export function MissionCard({ mission }: { mission: Mission }) {
  const { state } = useCampus();
  const done = state.completed.includes(mission.id);
  return (
    <Link
      to={`/missions/${mission.id}`}
      className={`${s.missionCard} ${s[mission.kind]}`}
    >
      <span className={s.missionIcon}>
        <MissionIcon kind={mission.kind} />
      </span>
      <div className={s.missionBody}>
        <div className={s.missionHeading}>
          <h3>{mission.title}</h3>
          <span className={s.points}>+{mission.points}P</span>
        </div>
        <p>{mission.short}</p>
        <div className={s.progressRow}>
          <span className={s.progress}>
            <span style={{ width: done ? "100%" : "0%" }} />
          </span>
          <small>{done ? "1" : "0"} / 1</small>
        </div>
      </div>
      <span className={done ? s.doneIcon : s.cardArrow}>
        {done ? <Check size={18} /> : <ChevronRight size={20} />}
      </span>
    </Link>
  );
}
