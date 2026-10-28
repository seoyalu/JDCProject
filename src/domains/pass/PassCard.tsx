import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { useCampus } from "../../app/state/CampusContext";
import { currentTime, growth, isVerified } from "../../app/state/campus";
import { Mong } from "../../shared/ui/Winter";
import { number } from "../../shared/lib/format";
import s from "../../styles/App.module.css";
export function PassCard() {
  const { state } = useCampus();
  const verified = isVerified(state, currentTime(state));
  const g = growth(state.xp);
  return (
    <section className={s.passCard}>
      <div className={s.passTop}>
        <strong>CAMPUS PASS</strong>
        <Link to={verified ? "/pass" : "/verify"}>
          Jeju <ArrowRight size={12} />
        </Link>
      </div>
      <div className={s.passProfile}>
        <span className={s.passAvatar}>
          <Mong alt="김제디의 해녀몽이 프로필" />
        </span>
        <div>
          <h2>김제디</h2>
          <p>제주대학교 {verified && `· ${state.enrollment}`}</p>
          <span className={verified ? s.verified : s.unverified}>
            {verified ? (
              <CheckCircle2 size={13} />
            ) : (
              <GraduationCap size={13} />
            )}{" "}
            {verified ? "대학생 인증 완료" : "대학생 인증하고 시작해요"}
          </span>
        </div>
        <div className={s.barcode} aria-hidden="true" />
      </div>
      {verified ? (
        <div className={s.passStats}>
          <Link to="/my?tab=points">
            <strong>
              {number(state.points)}
              <small>P</small>
            </strong>
            <span>포인트</span>
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
      ) : (
        <Link to="/verify" className={s.primaryButton}>
          인증하고 500P 받기 <ArrowRight size={16} />
        </Link>
      )}
    </section>
  );
}
