import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Gift,
  Home,
  Map,
  Snowflake,
  UserRound,
} from "lucide-react";
import { useCampus } from "./state/CampusContext";
import { Modal } from "../shared/ui/Modal";
import { Mong } from "../shared/ui/Winter";
import { CampusHome } from "../domains/home/HomePage";
import { MissionDetail } from "../domains/missions/MissionDetailPage";
import { MissionComplete } from "../domains/missions/MissionCompletePage";
import { Missions } from "../domains/missions/MissionsPage";
import { CampusMap } from "../domains/map/MapPage";
import { Benefits } from "../domains/benefits/BenefitsPage";
import { Pass } from "../domains/pass/PassPage";
import { Verify } from "../domains/pass/VerifyPage";
import { MyCampus } from "../domains/profile/MyCampusPage";
import { NotFound } from "../shared/ui/NotFound";
import s from "../styles/App.module.css";
const nav = [
  { to: "/", label: "홈", icon: Home },
  { to: "/map", label: "제주 캠퍼스 지도", mobile: "지도", icon: Map },
  { to: "/benefits", label: "CAMPUS 혜택", mobile: "혜택", icon: Gift },
  { to: "/my", label: "MY", icon: UserRound },
];
export function App() {
  const location = useLocation();
  const { state, storageAvailable } = useCampus();
  const [notice, setNotice] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return (
    <>
      <a href="#main" className={s.skipLink}>
        본문 바로가기
      </a>
      <header className={s.header}>
        <div className={s.headerInner}>
          <Link to="/" className={s.brand} aria-label="JDC CAMPUS 홈">
            JDC <b>CAMPUS</b>
            <i />
          </Link>
          <nav className={s.desktopNav} aria-label="주 메뉴">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                end={n.to === "/"}
                to={n.to}
                className={({ isActive }) => (isActive ? s.activeNav : "")}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className={s.headerActions}>
            <span className={s.winterBadge}>
              <Snowflake size={13} /> WINTER 2026
            </span>
            <button
              className={s.iconButton}
              aria-label="알림 보기"
              onClick={() => setNotice(true)}
            >
              <Bell size={21} />
              {state.notifications && <i className={s.notificationDot} />}
            </button>
            <Link to="/my" className={s.headerAvatar} aria-label="나의 CAMPUS">
              <Mong alt="" />
            </Link>
          </div>
        </div>
      </header>
      <div className={s.demoStrip}>
        <Snowflake size={12} />
        {state.clock === "season"
          ? "겨울방학 체험 모드 · 2027.01.05"
          : "실제 날짜로 보기"}
        <Link to="/my?tab=settings">
          체험 설정 <ArrowRight size={11} />
        </Link>
      </div>
      {!storageAvailable && (
        <div className={s.storageWarning} role="status">
          브라우저 저장 공간을 사용할 수 없어 새로고침하면 체험 기록이
          초기화됩니다.
        </div>
      )}
      <main id="main" className={s.main}>
        <Routes>
          <Route path="/" element={<CampusHome />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/:id" element={<MissionDetail />} />
          <Route path="/missions/:id/complete" element={<MissionComplete />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/pass" element={<Pass />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/my" element={<MyCampus />} />
          <Route path="/passport" element={<Navigate to="/map" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className={s.footer}>
        <b>JDC CAMPUS</b>
        <span>겨울방학, 제주에서 시작하는 특별한 캠퍼스 라이프</span>
        <small>발표용 체험 서비스 · 포인트·쿠폰·위치 인증은 데모입니다.</small>
      </footer>
      <nav className={s.mobileNav} aria-label="모바일 메뉴">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            className={({ isActive }) => (isActive ? s.activeMobile : "")}
          >
            <n.icon size={21} />
            <span>{n.mobile ?? n.label}</span>
          </NavLink>
        ))}
      </nav>
      {notice && (
        <Modal title="겨울 CAMPUS 소식" onClose={() => setNotice(false)}>
          <Mong className={s.modalMong} />
          <h3>이번 겨울, 해녀몽이와 제주를 탐험해요!</h3>
          <p className={s.modalText}>
            대학생 인증으로 500P를 받고, 여행 전부터 나만의 제주 이야기를 시작해
            보세요.
          </p>
          <Link
            to={state.verifiedAt ? "/missions" : "/verify"}
            className={s.primaryButton}
            onClick={() => setNotice(false)}
          >
            겨울방학 시작하기 <ArrowRight size={17} />
          </Link>
        </Modal>
      )}
    </>
  );
}
