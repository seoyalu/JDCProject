import { Link } from "react-router-dom";
import { Empty } from "./Empty";
import s from "../../styles/App.module.css";

export function NotFound() {
  return (
    <div className={s.page}>
      <Empty title="이 페이지는 아직 제주 여행 중이에요">
        주소를 다시 확인하거나 CAMPUS 홈으로 돌아가 주세요.
      </Empty>
      <Link className={s.primaryButton} to="/">
        CAMPUS 홈으로
      </Link>
    </div>
  );
}
