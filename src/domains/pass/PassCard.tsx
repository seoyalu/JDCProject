import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Waves } from "lucide-react";
import { useCampus } from "../../app/state/CampusContext";
import { number } from "../../shared/lib/format";
import s from "../../styles/App.module.css";

export function PassCard({ compact = false }: { compact?: boolean }) {
  const { state } = useCampus();
  return (
    <Link
      to="/pass"
      className={`${s.passCard} ${compact ? s.compactPass : ""}`}
      aria-label="김제디의 대학생 PASS 자세히 보기"
    >
      <div className={s.passTop}>
        <span>JDC CAMPUS</span>
        <span>
          <ShieldCheck size={14} /> 대학생 인증 완료
        </span>
      </div>
      <div className={s.passHeading}>
        <h2>대학생 PASS</h2>
        {compact ? (
          <strong className={s.passPoints}>
            {number(state.points)}
            <small>P</small>
          </strong>
        ) : (
          <Waves size={39} strokeWidth={1.3} />
        )}
      </div>
      <div className={s.passPerson}>
        <span>
          제주대학교 <strong>김제디</strong>
        </span>
        <span className={s.passPill}>새내기</span>
      </div>
      <div className={s.barcodeRow}>
        <div className={s.barcode} aria-hidden="true" />
        <span>2026 0318 7790</span>
        <ArrowUpRight size={16} />
      </div>
    </Link>
  );
}
