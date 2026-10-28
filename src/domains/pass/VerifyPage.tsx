import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { useCampus } from "../../app/state/CampusContext";
import { currentTime, isVerified } from "../../app/state/campus";
import { Mong } from "../../shared/ui/Winter";
import s from "../../styles/App.module.css";
export function Verify() {
  const { state, dispatch } = useCampus();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<"재학" | "휴학">("재학");
  const [agreed, setAgreed] = useState(false);
  const verified = isVerified(state, currentTime(state));
  return (
    <div className={s.verifyPage}>
      <Link to="/" className={s.backLink}>
        <ArrowLeft size={16} /> 홈으로
      </Link>
      <Mong className={s.verifyMong} />
      <span className={s.eyebrow}>YOUR CAMPUS, YOUR BENEFITS</span>
      <h1>
        대학생이라서,
        <br />
        제주가 더 특별해져요.
      </h1>
      <p className={s.verifyLead}>
        인증 한 번으로 CAMPUS PASS와
        <br />
        <strong>웰컴 포인트 500P</strong>를 받아보세요.
      </p>
      {verified ? (
        <>
          <div className={s.infoBox}>
            <ShieldCheck />
            대학생 인증이 완료되었어요.
          </div>
          <Link className={s.primaryButton} to="/missions">
            여행 전 미션 시작하기 <ArrowRight size={18} />
          </Link>
        </>
      ) : state.verifiedAt ? (
        <>
          <p className={s.infoBox}>
            현재 선택한 날짜가 인증 유효기간 밖입니다. MY의 체험 설정에서
            겨울방학 모드로 돌아가거나 초기화 후 다시 인증해 주세요.
          </p>
          <Link className={s.primaryButton} to="/my?tab=settings">
            체험 설정 열기
          </Link>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!agreed) return;
            dispatch({ type: "verify", enrollment, at: currentTime(state) });
            navigate("/pass?welcome=1");
          }}
        >
          <div className={s.demoProfile}>
            <GraduationCap size={24} />
            <div>
              <strong>김제디 · 제주대학교</strong>
              <p>개인정보를 입력하지 않는 가상 체험 계정</p>
            </div>
          </div>
          <fieldset className={s.enrollment}>
            <legend>대학생 인증 상태</legend>
            {(["재학", "휴학"] as const).map((v) => (
              <label key={v}>
                <input
                  type="radio"
                  name="enrollment"
                  checked={enrollment === v}
                  onChange={() => setEnrollment(v)}
                />
                {v} 중
              </label>
            ))}
          </fieldset>
          <label className={s.consent}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            실제 대학 인증이 아닌 데모 체험임을 확인했어요.
          </label>
          <button className={s.primaryButton} disabled={!agreed}>
            데모 인증하고 500P 받기 <ArrowRight size={18} />
          </button>
          <p className={s.smallPrint}>
            실제 서비스에서는 외부 대학생 인증 결과와 연동해요.
            <br />
            학생증·학번 등의 원본 정보는 수집하지 않습니다.
          </p>
        </form>
      )}
    </div>
  );
}
