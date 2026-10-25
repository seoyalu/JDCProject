import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Bell } from "lucide-react";
import { Compass } from "lucide-react";
import { Gift } from "lucide-react";
import { Home } from "lucide-react";
import { UserRound } from "lucide-react";
import { Waves } from "lucide-react";
import { useCampus } from "./state/CampusContext";
import { Modal } from "../shared/ui/Modal";
import { CampusHome } from "../domains/home/HomePage";
import { MissionDetail } from "../domains/missions/MissionDetailPage";
import { MissionComplete } from "../domains/missions/MissionCompletePage";
import { Benefits } from "../domains/benefits/BenefitsPage";
import { Pass } from "../domains/pass/PassPage";
import { MyCampus } from "../domains/profile/MyCampusPage";
import { NotFound } from "../shared/ui/NotFound";
import s from "../styles/App.module.css";

const nav = [
  { to: "/", label: "CAMPUS 홈", mobile: "홈", icon: Home },
  { to: "/missions", label: "오늘의 미션", mobile: "미션", icon: Compass },
  { to: "/benefits", label: "혜택 & 쿠폰", mobile: "혜택", icon: Gift },
  { to: "/my", label: "마이 캠퍼스", mobile: "마이", icon: UserRound },
];

export function App() {
  const location = useLocation();
  const { storageAvailable } = useCampus();
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
            <span className={s.brandMark}>
              <Waves size={25} />
            </span>
            <span>
              JDC <b>CAMPUS</b>
              <small>JEJU DUTY FREE</small>
            </span>
          </Link>
          <nav className={s.desktopNav} aria-label="주 메뉴">
            {nav.map((n) => (
              <NavLink
                end={n.to === "/"}
                key={n.to}
                to={n.to}
                className={({ isActive }) => (isActive ? s.activeNav : "")}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className={s.headerActions}>
            <span className={s.demoBadge}>체험 서비스</span>
            <button
              className={s.iconButton}
              aria-label="알림 보기"
              onClick={() => setNotice(true)}
            >
              <Bell size={21} />
              <i className={s.notificationDot} />
            </button>
            <Link to="/my" className={s.avatar} aria-label="김제디 마이 캠퍼스">
              제디
            </Link>
          </div>
        </div>
      </header>
      {!storageAvailable && (
        <div className={s.storageWarning} role="status">
          브라우저 저장 공간을 사용할 수 없어 이번 체험은 새로고침하면
          초기화됩니다.
        </div>
      )}
      <main id="main" className={s.main}>
        <Routes>
          <Route path="/" element={<CampusHome />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/:id" element={<MissionDetail />} />
          <Route path="/missions/:id/complete" element={<MissionComplete />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/pass" element={<Pass />} />
          <Route path="/my" element={<MyCampus />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className={s.footer}>
        <span>
          <b>JDC CAMPUS</b> 제주에서 만나는 특별한 오늘
        </span>
        <span>발표용 프로토타입 · 포인트와 쿠폰은 체험용입니다.</span>
      </footer>
      <nav className={s.mobileNav} aria-label="모바일 메뉴">
        {nav.map((n) => (
          <NavLink
            end={n.to === "/"}
            key={n.to}
            to={n.to}
            className={({ isActive }) => (isActive ? s.activeMobile : "")}
          >
            <n.icon size={22} />
            <span>{n.mobile}</span>
          </NavLink>
        ))}
      </nav>
      {notice && (
        <Modal title="CAMPUS 소식" onClose={() => setNotice(false)}>
          <div className={s.noticeIcon}>
            <Gift size={30} />
          </div>
          <h3>제디님, 제주에 오신 걸 환영해요!</h3>
          <p className={s.modalText}>
            웰컴 포인트 300P를 준비했어요. 면세점 방문 미션에 참여하고 200P를 더
            모아 무료배송 쿠폰으로 교환해 보세요.
          </p>
          <Link
            to="/missions/jdc-visit"
            className={s.primaryButton}
            onClick={() => setNotice(false)}
          >
            첫 미션 만나보기 <ArrowRight size={18} />
          </Link>
        </Modal>
      )}
    </>
  );
}
import { Missions } from "../domains/missions/MissionsPage";
