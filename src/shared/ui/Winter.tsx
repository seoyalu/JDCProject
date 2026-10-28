import { Link } from "react-router-dom";
import { ArrowRight, Snowflake, Sparkles } from "lucide-react";
import { growth } from "../../app/state/campus";
import { useCampus } from "../../app/state/CampusContext";
import s from "../../styles/App.module.css";

export function Mong({
  className = "",
  alt = "해녀몽이",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      className={`${s.mong} ${className}`}
      src="/images/haenyeo-mongi.webp"
      alt={alt}
    />
  );
}
export function GrowthCard() {
  const { state } = useCampus();
  const g = growth(state.xp);
  return (
    <Link to="/my?tab=growth" className={s.growthCard}>
      <Mong alt="함께 성장하는 해녀몽이" />
      <div>
        <span className={s.eyebrow}>MY LITTLE TRAVEL MATE</span>
        <h3>
          LV.{g.level} {g.title}
        </h3>
        <p>
          {g.remaining
            ? `다음 레벨까지 ${g.remaining}XP 남았어요`
            : "제주 마스터가 되었어요!"}
        </p>
        <span className={s.progress}>
          <i style={{ width: `${g.progress}%` }} />
        </span>
        <small>{state.xp} XP · 함께 쌓은 제주 이야기</small>
      </div>
      <ArrowRight size={17} />
    </Link>
  );
}
export function SeasonLabel() {
  return (
    <span className={s.seasonLabel}>
      <Snowflake size={13} /> 겨울방학 한정
    </span>
  );
}
export function RewardPill({ points }: { points: number }) {
  return (
    <span className={s.rewardPill}>
      <Sparkles size={12} /> +{points}P
    </span>
  );
}
