import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  LockKeyhole,
  MapPin,
  Plane,
  Search,
  Snowflake,
} from "lucide-react";
import { placeMissions, SEASON } from "../missions/catalog";
import { useCampus } from "../../app/state/CampusContext";
import {
  hasCompleted,
  lockReason,
  missionStatus,
} from "../../app/state/campus";
import { Mong, SeasonLabel } from "../../shared/ui/Winter";
import { date } from "../../shared/lib/format";
import s from "../../styles/App.module.css";
export function CampusMap() {
  const { state } = useCampus();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const selected =
    placeMissions.find((m) => m.id === params.get("place")) ?? placeMissions[0];
  const done = placeMissions.filter((m) => hasCompleted(state, m.id)).length;
  const pct = Math.round((done / placeMissions.length) * 100);
  const visible = placeMissions.filter(
    (m) =>
      (filter === "전체" ||
        (filter === "겨울방학 한정" && m.seasonal) ||
        (filter === "상시" && !m.seasonal) ||
        (filter === "완료" && hasCompleted(state, m.id))) &&
      `${m.title} ${m.location}`.includes(search.trim()),
  );
  const status = missionStatus(state, selected);
  const record = state.completed.find((c) => c.missionId === selected.id);
  return (
    <div className={s.mapPage}>
      <div className={s.mapHeading}>
        <div>
          <span className={s.eyebrow}>JEJU IS OUR CAMPUS</span>
          <h1>제주 캠퍼스 지도</h1>
        </div>
        <span>
          <Snowflake size={15} /> WINTER EXPLORER
        </span>
      </div>
      <div className={s.mapToolbar}>
        <div className={s.filterBar} aria-label="지도 필터">
          {["전체", "겨울방학 한정", "상시", "완료"].map((f) => (
            <button
              key={f}
              className={filter === f ? s.selectedFilter : ""}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <label className={s.mapSearch}>
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="장소 검색"
            aria-label="지도 장소 검색"
          />
        </label>
      </div>
      <div className={s.mapLayout}>
        <section className={s.mapCanvas} aria-label="겨울 제주 탐험 지도">
          <img
            className={s.mapBackground}
            src="/images/winter-map.webp"
            alt="한라산과 제주 해안을 그린 겨울 제주 일러스트 지도"
          />
          <span className={s.mapNorth}>
            <Compass size={20} /> N
          </span>
          {visible.map((m) => {
            const st = missionStatus(state, m);
            const complete = st === "완료";
            const locked = ["잠금", "예정", "종료"].includes(st);
            return (
              <button
                key={m.id}
                className={`${s.mapPin} ${complete ? s.completePin : locked ? s.lockedPin : st === "진행 중" ? s.progressPin : s.availablePin} ${selected.id === m.id ? s.selectedPin : ""}`}
                style={{
                  left: `${m.position![0]}%`,
                  top: `${m.position![1]}%`,
                }}
                onClick={() => setParams({ place: m.id })}
                aria-label={`${m.location} · ${st}`}
                aria-pressed={selected.id === m.id}
              >
                <span>
                  {complete ? (
                    <Mong alt="완료" />
                  ) : locked ? (
                    <LockKeyhole size={20} />
                  ) : m.id === "airport" ? (
                    <Plane size={21} />
                  ) : (
                    <MapPin size={21} />
                  )}
                </span>
                <strong>
                  {m.id === "jdc-visit"
                    ? "JDC 면세점"
                    : m.location
                        .replace("제주국제공항", "제주공항")
                        .replace("제주 동문시장", "동문시장")
                        .replace(" 캠페인 부스", "")}
                </strong>
                {complete && (
                  <i>
                    <CheckCircle2 size={12} />
                  </i>
                )}
              </button>
            );
          })}
          {!visible.length && (
            <div className={s.mapEmpty}>
              조건에 맞는 장소가 없어요.
              <br />
              다른 필터나 검색어로 찾아보세요.
            </div>
          )}
          <div className={s.mapCaption}>
            JEJU ISLAND <span>나의 겨울, 나의 캠퍼스</span>
          </div>
        </section>
        <aside className={s.mapSidebar}>
          <div className={s.explorationCard}>
            <div>
              <span className={s.eyebrow}>MY WINTER FOOTPRINTS</span>
              <h2>겨울방학 제주 탐험률</h2>
              <p>
                <strong>
                  {done}
                  <small> / {placeMissions.length}곳 완료</small>
                </strong>
                <b>{pct}%</b>
              </p>
              <span className={s.progress}>
                <i style={{ width: `${pct}%` }} />
              </span>
            </div>
            <div className={s.pinLegend}>
              <span>
                <i />
                가능
              </span>
              <span>
                <i />
                진행 중
              </span>
              <span>
                <i />
                완료
              </span>
              <span>
                <i />
                잠금
              </span>
            </div>
          </div>
          <article className={s.placeCard} key={selected.id}>
            <div className={s.placeCardVisual}>
              <Mong alt="제주를 탐험하는 해녀몽이" />
              <span>
                {selected.seasonal ? (
                  <SeasonLabel />
                ) : (
                  <span className={s.alwaysTag}>상시 미션</span>
                )}
              </span>
            </div>
            <div className={s.placeCardBody}>
              <span className={s.placeStatus}>{status}</span>
              <h2>{selected.location}</h2>
              <p>{selected.short}</p>
              <div className={s.placeRewards}>
                <b>+{selected.points}P</b>
                <span>스탬프 1개</span>
                <span>+{selected.xp}XP</span>
              </div>
              <small>
                {selected.seasonal ? SEASON.period : "상시 · 체험 기간 내 1회"}
              </small>
              {record ? (
                <p className={s.visitRecord}>
                  <CheckCircle2 size={15} />
                  {date(record.at)} 방문 · {selected.points}P 획득
                </p>
              ) : (
                lockReason(state, selected) && (
                  <p className={s.lockReason}>
                    <LockKeyhole size={14} />
                    {lockReason(state, selected)}
                  </p>
                )
              )}
              <Link className={s.primaryButton} to={`/missions/${selected.id}`}>
                {record ? "방문 기록 보기" : "미션 자세히 보기"}
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>
          {!hasCompleted(state, "airport") && (
            <Link className={s.mapArrival} to="/missions/airport">
              <Plane size={22} />
              <span>
                제주에 도착했어요!<small>공항 인증으로 현장 미션 열기</small>
              </span>
              <ChevronRight size={17} />
            </Link>
          )}
        </aside>
      </div>
      <p className={s.smallPrint}>
        장소 배치는 탐험을 위한 일러스트 표현이며 실제 길찾기 지도가 아닙니다.
        QR·GPS는 데모 인증으로 체험합니다.
      </p>
      <div className={s.mapPlaceList}>
        <h2>탐험할 장소 {visible.length}</h2>
        {visible.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setParams({ place: m.id });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <MapPin size={16} />
            {m.location}
            <span>{missionStatus(state, m)}</span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
    </div>
  );
}
