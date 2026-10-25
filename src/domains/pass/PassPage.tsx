import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { missions } from "../missions/catalog";
import { useCampus } from "../../app/state/CampusContext";
import { MissionIcon } from "../missions/MissionIcon";
import { number } from "../../shared/lib/format";
import { PassCard } from "./PassCard";
import { PageHeading } from "../../shared/ui/PageHeading";
import s from "../../styles/App.module.css";

export function Pass() {
  const { state } = useCampus();
  return (
    <div className={s.page}>
      <PageHeading
        eyebrow="MY CAMPUS PASS"
        title="나의 제주를 담은 PASS"
        description="대학생의 특별한 자격, 그리고 차곡차곡 쌓이는 여행의 기록."
      />
      <div className={s.passPageGrid}>
        <section>
          <PassCard />
          <div className={s.passInfo}>
            <span>
              <ShieldCheck size={18} />
              대학생 인증 완료
            </span>
            <p>제주대학교 · 김제디</p>
            <small>체험 계정 · 인증 기간 2026.10.25 – 2027.10.24</small>
          </div>
          <div className={s.passBalance}>
            <span>보유 포인트</span>
            <strong>{number(state.points)}P</strong>
            <Link to="/my?tab=points">
              내역 보기 <ChevronRight size={14} />
            </Link>
          </div>
        </section>
        <section className={s.passport}>
          <div className={s.passportHeader}>
            <BookOpen size={25} />
            <div>
              <span className={s.eyebrow}>MY JEJU PASSPORT</span>
              <h2>제디의 스탬프 여권</h2>
            </div>
            <strong>
              {state.completed.length}
              <small> / {missions.length}</small>
            </strong>
          </div>
          <div className={s.stampGrid}>
            {missions.map((m) => {
              const done = state.completed.includes(m.id);
              return (
                <Link
                  key={m.id}
                  to={`/missions/${m.id}`}
                  className={`${s.stampItem} ${done ? s.earnedStamp : ""}`}
                >
                  <span>
                    <MissionIcon kind={m.kind} size={32} />
                    {done && <CheckCircle2 size={18} />}
                  </span>
                  <strong>{m.stamp}</strong>
                  <small>{done ? "수집 완료" : "미션으로 만나기"}</small>
                </Link>
              );
            })}
          </div>
          <p className={s.passportNote}>
            스탬프는 사용해도 사라지지 않는 나만의 제주 추억이에요.
          </p>
        </section>
      </div>
      <Link to="/missions" className={s.primaryButton}>
        다음 제주 이야기 만나기 <ArrowRight size={18} />
      </Link>
    </div>
  );
}
