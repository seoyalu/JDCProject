import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Map } from "lucide-react";
import { PassCard } from "./PassCard";
import { GrowthCard } from "../../shared/ui/Winter";
import { PageHeading } from "../../shared/ui/PageHeading";
import { useCampus } from "../../app/state/CampusContext";
import { date } from "../../shared/lib/format";
import s from "../../styles/App.module.css";
export function Pass() {
  const { state } = useCampus();
  const [params] = useSearchParams();
  return (
    <div className={s.narrowPage}>
      <PageHeading
        eyebrow="MY CAMPUS PASS"
        title={
          params.has("welcome")
            ? "CAMPUS의 새 친구가 되었어요!"
            : "나의 CAMPUS PASS"
        }
        description={
          params.has("welcome")
            ? "인증 완료! 500P가 지급되었어요. 이제 여행을 준비해 볼까요?"
            : "대학생의 특별한 자격과 겨울 제주 이야기를 담았어요."
        }
      />
      <PassCard />
      {state.verifiedAt && (
        <p className={s.passValidity}>
          <CheckCircle2 size={15} /> {date(state.verifiedAt)} 인증 · 1년간 유효
          · 체험용
        </p>
      )}
      <GrowthCard />
      <Link className={s.mapCallout} to="/map">
        <Map size={27} />
        <div>
          <h3>발자국은 지도에 남겨요</h3>
          <p>다녀온 장소와 해녀몽이 스탬프를 확인하세요.</p>
        </div>
        <ArrowRight size={18} />
      </Link>
      <Link to="/missions" className={s.primaryButton}>
        겨울방학 미션 만나보기 <ArrowRight size={17} />
      </Link>
    </div>
  );
}
