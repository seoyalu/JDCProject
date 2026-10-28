import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  LockKeyhole,
  MapPin,
  Plane,
  Snowflake,
} from "lucide-react";
import { missions, SEASON } from "../missions/catalog";
import { useCampus } from "../../app/state/CampusContext";
import { currentTime, hasCompleted, isVerified } from "../../app/state/campus";
import { PassCard } from "../pass/PassCard";
import { MissionCard } from "../missions/MissionCard";
import { SectionTitle } from "../../shared/ui/SectionTitle";
import s from "../../styles/App.module.css";
export function CampusHome() {
  const { state } = useCampus();
  const verified = isVerified(state, currentTime(state));
  const arrived = hasCompleted(state, "airport");
  const available = missions.filter(
    (m) => m.stage === "before" && !hasCompleted(state, m.id),
  );
  return (
    <>
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <span className={s.heroTag}>
            <Snowflake size={14} /> HELLO, WINTER CAMPUS
          </span>
          <h1>
            겨울방학,
            <br />
            캠퍼스는 <em>제주.</em>
          </h1>
          <p>
            여행을 꿈꾸는 순간부터, 혜택이 되는 시간.
            <br />
            해녀몽이와 함께 특별한 겨울을 만나보세요.
          </p>
          <Link
            to={verified ? "/missions" : "/verify"}
            className={s.heroButton}
          >
            {verified ? "겨울방학 미션 둘러보기" : "대학생 인증하고 500P 받기"}
            <ArrowRight size={17} />
          </Link>
          <span className={s.heroPeriod}>{SEASON.period}</span>
        </div>
        <div className={s.heroSpeech}>
          이번 겨울방학,
          <br />
          나랑 제주 탐험할래? <span>해녀몽이와 함께 떠나요!</span>
        </div>
        <span className={s.heroLocation}>
          <MapPin size={12} /> WINTER IN JEJU
        </span>
      </section>
      <div className={s.homeColumns}>
        <aside className={s.homeAside}>
          <PassCard />
        </aside>
        <div className={s.homeMissions}>
          <SectionTitle
            eyebrow="BEFORE YOUR TRIP"
            title="여행은, 이미 시작됐어요"
            to="/missions"
            link="시즌 미션 전체"
          />
          <p className={s.sectionDescription}>
            제주에 가기 전에도 참여할 수 있어요.
          </p>
          <div className={s.missionList}>
            {(available.length
              ? available
              : missions.filter((m) => m.stage === "before")
            )
              .slice(0, 3)
              .map((m) => (
                <MissionCard key={m.id} mission={m} />
              ))}
          </div>
          <div className={s.sectionGap}>
            <SectionTitle
              eyebrow="NEXT STOP, JEJU"
              title={
                arrived
                  ? "제주에서 만나는 새로운 경험"
                  : "제주에 가면 열리는 미션"
              }
              to="/map"
              link="지도 보기"
            />
          </div>
          <Link to="/missions/airport" className={s.arrivalCard}>
            <span>
              <Plane size={25} />
            </span>
            <div>
              <h3>
                {arrived ? "제주 도착 인증 완료!" : "제주공항에 도착하셨나요?"}
              </h3>
              <p>
                {arrived
                  ? "해녀몽이와 현장 미션을 탐험해요"
                  : "도착을 인증하고 현장 미션을 열어보세요"}
              </p>
            </div>
            <b>{arrived ? "완료" : "+500P"}</b>
            <ChevronRight size={17} />
          </Link>
          <div className={s.placePreview}>
            {["seongsan", "dongmun"].map((id) => {
              const m = missions.find((m) => m.id === id)!;
              return (
                <Link key={id} to={`/missions/${id}`}>
                  <div
                    className={`${s.placeThumb} ${id === "dongmun" ? s.marketThumb : ""}`}
                  >
                    {!arrived && (
                      <span>
                        <LockKeyhole size={17} />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3>{m.location}</h3>
                    <p>
                      {arrived
                        ? "지금 참여할 수 있어요"
                        : "제주 도착 후 참여 가능"}
                    </p>
                    <strong>+{m.points}P</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
