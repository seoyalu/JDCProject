import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  LockKeyhole,
  MapPin,
  Navigation,
  QrCode,
  Sparkles,
  Stamp,
} from "lucide-react";
import {
  missions,
  SEASON,
  bucketOptions,
  wishOptions,
  tasteOptions,
  validAnswer,
} from "./catalog";
import type { AuthMethod } from "./catalog";
import { MissionIcon } from "./MissionIcon";
import { useCampus } from "../../app/state/CampusContext";
import {
  currentTime,
  isVerified,
  lockReason,
  missionStatus,
} from "../../app/state/campus";
import { Modal } from "../../shared/ui/Modal";
import { NotFound } from "../../shared/ui/NotFound";
import { date } from "../../shared/lib/format";
import { Mong } from "../../shared/ui/Winter";
import s from "../../styles/App.module.css";
export function MissionDetail() {
  const { id } = useParams();
  const mission = missions.find((m) => m.id === id);
  const { state, dispatch } = useCampus();
  const navigate = useNavigate();
  const [method, setMethod] = useState<AuthMethod>("qr");
  const [confirm, setConfirm] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [choice, setChoice] = useState("");
  const [friend, setFriend] = useState("");
  const [reflection, setReflection] = useState("");
  if (!mission) return <NotFound />;
  const now = currentTime(state);
  const status = missionStatus(state, mission);
  const done = status === "완료";
  const locked = ["잠금", "예정", "종료"].includes(status);
  const onsite = mission.stage === "onsite";
  const actualMethod = onsite
    ? mission.methods.includes(method)
      ? method
      : mission.methods[0]
    : "app";
  const answer =
    mission.kind === "bucket" || mission.kind === "wishlist"
      ? JSON.stringify(selected)
      : mission.kind === "taste"
        ? choice
        : mission.kind === "friend"
          ? JSON.stringify({ friend, place: choice })
          : mission.kind === "share"
            ? reflection
            : undefined;
  const valid = validAnswer(mission, answer);
  const record = state.completed.find((c) => c.missionId === mission.id);
  function start() {
    if (!mission) return;
    dispatch({ type: "start", missionId: mission.id, at: now });
  }
  function complete() {
    if (!mission || locked || done || !valid) return;
    dispatch({
      type: "complete",
      missionId: mission.id,
      at: now,
      method: actualMethod,
      answer,
    });
    setConfirm(false);
    navigate(`/missions/${mission.id}/complete`, { replace: true });
  }
  function toggle(v: string) {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  }
  return (
    <div className={s.detailPage}>
      <div className={s.detailTop}>
        <Link
          className={s.backLink}
          to={onsite ? `/map?place=${mission.id}` : "/missions"}
        >
          <ArrowLeft size={17} />
          {onsite ? "제주 캠퍼스 지도" : "시즌 미션"}
        </Link>
        <button
          className={`${s.iconButton} ${state.favorites.includes(mission.id) ? s.liked : ""}`}
          aria-label="관심 미션 저장"
          aria-pressed={state.favorites.includes(mission.id)}
          onClick={() => dispatch({ type: "favorite", missionId: mission.id })}
        >
          <Heart size={21} />
        </button>
      </div>
      <div
        className={`${s.detailIllustration} ${onsite ? s.onsiteIllustration : s.preIllustration}`}
      >
        <span className={s.detailSceneLabel}>
          {onsite ? "A WINTER MOMENT IN JEJU" : "YOUR JOURNEY STARTS HERE"}
        </span>
        {!onsite && (
          <>
            <MissionIcon kind={mission.kind} size={64} />
            <Mong />
          </>
        )}
      </div>
      <section className={s.detailContent}>
        <div className={s.detailTags}>
          <span className={mission.seasonal ? s.seasonTag : s.alwaysTag}>
            {mission.seasonal ? "겨울방학 한정" : "상시 미션"}
          </span>
          <span>{status}</span>
        </div>
        <h1>{mission.title}</h1>
        <p className={s.detailDescription}>{mission.description}</p>
        <div className={s.missionRewards}>
          <div>
            <b className={s.coin}>P</b>
            <strong>+{mission.points}P</strong>
          </div>
          <div>
            <Stamp size={22} />
            <span>
              스탬프<strong>1개</strong>
            </span>
          </div>
          <div>
            <Sparkles size={22} />
            <span>
              해녀몽이<strong>+{mission.xp}XP</strong>
            </span>
          </div>
        </div>
        <dl className={s.detailFacts}>
          <div>
            <dt>참여 기간</dt>
            <dd>
              {mission.seasonal ? SEASON.period : "상시 · 체험 기간 내 1회"}
            </dd>
          </div>
          <div>
            <dt>참여 대상</dt>
            <dd>인증된 대학생 · 재학생 / 휴학생</dd>
          </div>
          <div>
            <dt>
              <MapPin size={13} /> 장소
            </dt>
            <dd>{mission.location}</dd>
          </div>
          <div>
            <dt>
              <Clock3 size={13} /> 소요 시간
            </dt>
            <dd>약 {mission.duration}</dd>
          </div>
        </dl>
        {done ? (
          <div className={s.completedDetail}>
            <CheckCircle2 size={24} />
            <h3>해녀몽이가 이곳을 다녀왔어요!</h3>
            <p>
              {record && date(record.at)} · {mission.points}P · {mission.xp}XP
            </p>
            {record?.answer && (
              <p className={s.savedAnswer}>
                내 기록: {formatAnswer(mission.kind, record.answer)}
              </p>
            )}
            <Link
              to={onsite ? `/map?place=${mission.id}` : "/my"}
              className={s.primaryButton}
            >
              나의 기록 보기 <ArrowRight size={16} />
            </Link>
          </div>
        ) : locked ? (
          <div className={s.lockedDetail}>
            <LockKeyhole size={27} />
            <h3>{lockReason(state, mission)}</h3>
            <p>조건을 완료하면 미션 인증 버튼이 열려요.</p>
            <button className={s.primaryButton} disabled>
              아직 참여할 수 없어요
            </button>
            {status === "잠금" && (
              <Link
                className={s.secondaryButton}
                to={!isVerified(state, now) ? "/verify" : "/missions/airport"}
              >
                {!isVerified(state, now)
                  ? "대학생 인증하고 500P 받기"
                  : "제주공항 도착 인증하기"}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <>
            {onsite ? (
              <div className={s.authSection}>
                <h2>미션 인증하기</h2>
                <div className={s.methodTabs}>
                  {mission.methods.map((m) => (
                    <button
                      key={m}
                      aria-pressed={actualMethod === m}
                      className={actualMethod === m ? s.selectedMethod : ""}
                      onClick={() => setMethod(m)}
                    >
                      {m === "qr" ? "현장 QR 인증" : "GPS 인증"}
                    </button>
                  ))}
                </div>
                <div className={s.scanVisual}>
                  {actualMethod === "qr" ? (
                    <QrCode size={83} strokeWidth={1.4} />
                  ) : (
                    <Navigation size={73} strokeWidth={1.3} />
                  )}
                  <span />
                </div>
                <p>
                  {actualMethod === "qr"
                    ? "현장 QR을 인증하고 발자국을 남겨요."
                    : "해당 장소의 위치를 확인하고 인증해요."}
                  <br />
                  <small>
                    발표용 데모에서는 카메라·실제 위치를 사용하지 않아요.
                  </small>
                </p>
                <button
                  className={s.primaryButton}
                  onClick={() => {
                    start();
                    setConfirm(true);
                  }}
                >
                  {actualMethod === "qr"
                    ? "QR 인증 체험하기"
                    : "GPS 인증 체험하기"}
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <div className={s.preMissionForm}>
                <h2>
                  {mission.kind === "bucket"
                    ? "어떤 제주를 만나고 싶나요?"
                    : mission.kind === "wishlist"
                      ? "마음에 드는 선물을 3개 골라주세요"
                      : mission.kind === "taste"
                        ? "어떤 여행에 마음이 가나요?"
                        : mission.kind === "friend"
                          ? "함께 떠날 친구와 계획을 담아요"
                          : "나의 겨울 제주를 한 문장으로"}
                </h2>
                {status !== "진행 중" ? (
                  <button className={s.primaryButton} onClick={start}>
                    미션 참여 시작하기 <ArrowRight size={17} />
                  </button>
                ) : (
                  <>
                    {(mission.kind === "bucket" ||
                      mission.kind === "wishlist") && (
                      <fieldset className={s.choiceList}>
                        <legend>
                          {mission.kind === "wishlist"
                            ? `${selected.length} / 3개 이상 선택`
                            : "1개 이상 선택해 주세요"}
                        </legend>
                        {(mission.kind === "bucket"
                          ? bucketOptions
                          : wishOptions
                        ).map((v) => (
                          <label
                            key={v}
                            className={
                              selected.includes(v) ? s.selectedChoice : ""
                            }
                          >
                            <input
                              type="checkbox"
                              checked={selected.includes(v)}
                              onChange={() => toggle(v)}
                            />
                            {v}
                            <CheckCircle2 size={17} />
                          </label>
                        ))}
                      </fieldset>
                    )}
                    {mission.kind === "taste" && (
                      <fieldset className={s.choiceList}>
                        <legend>내 여행 취향</legend>
                        {tasteOptions.map((v) => (
                          <label
                            key={v}
                            className={choice === v ? s.selectedChoice : ""}
                          >
                            <input
                              type="radio"
                              name="taste"
                              checked={choice === v}
                              onChange={() => setChoice(v)}
                            />
                            {v}
                            <Heart size={16} />
                          </label>
                        ))}
                      </fieldset>
                    )}
                    {mission.kind === "friend" && (
                      <div className={s.formFields}>
                        <label>
                          친구 별명
                          <input
                            value={friend}
                            maxLength={30}
                            onChange={(e) => setFriend(e.target.value)}
                            placeholder="두 글자 이상 입력"
                          />
                        </label>
                        <label>
                          함께 하고 싶은 경험
                          <select
                            value={choice}
                            onChange={(e) => setChoice(e.target.value)}
                          >
                            <option value="">경험을 선택하세요</option>
                            {bucketOptions.map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </label>
                        <small>
                          친구에게 초대 메시지를 보내는 기능은 아닙니다.
                        </small>
                      </div>
                    )}
                    {mission.kind === "share" && (
                      <div className={s.formFields}>
                        <label>
                          여행 소감
                          <textarea
                            value={reflection}
                            maxLength={200}
                            onChange={(e) => setReflection(e.target.value)}
                            placeholder="제주에서 기억하고 싶은 순간을 5글자 이상 적어주세요"
                          />
                        </label>
                        <small>
                          {reflection.length} / 200자 · 완료 후 공유 문구를
                          복사할 수 있어요.
                        </small>
                      </div>
                    )}
                    <button
                      className={s.primaryButton}
                      disabled={!valid}
                      onClick={complete}
                    >
                      {mission.kind === "wishlist"
                        ? "위시리스트 저장하고"
                        : mission.kind === "taste"
                          ? "취향 저장하고"
                          : mission.kind === "share"
                            ? "활동 기록 완성하고"
                            : "계획 저장하고"}{" "}
                      {mission.points}P 받기 <ArrowRight size={17} />
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
        <p className={s.smallPrint}>
          미션별 1회 참여 · 완료 시 보상이 동시에 반영됩니다.
          <br />
          포인트·쿠폰·인증은 발표용 체험 데이터입니다.
        </p>
      </section>
      {confirm && (
        <Modal
          title={
            actualMethod === "qr" ? "현장 QR 인증 체험" : "GPS 위치 인증 체험"
          }
          onClose={() => setConfirm(false)}
        >
          <div className={s.modalAuthIcon}>
            {actualMethod === "qr" ? (
              <QrCode size={74} />
            ) : (
              <Navigation size={67} />
            )}
          </div>
          <h3>{mission.location}</h3>
          <p className={s.modalText}>
            이 장소에 도착한 상황을 체험합니다.
            <br />
            실제 QR 스캔이나 위치 확인 없이 데모 인증을 완료해요.
          </p>
          <button className={s.primaryButton} onClick={complete}>
            데모 인증 완료하기 <CheckCircle2 size={18} />
          </button>
        </Modal>
      )}
    </div>
  );
}
function formatAnswer(kind: string, answer: string) {
  try {
    const a = JSON.parse(answer);
    if (Array.isArray(a)) return a.join(" · ");
    if (kind === "friend") return `${a.friend}와 ${a.place}`;
  } catch {
    /* Plain text answers are displayed directly. */
  }
  return answer;
}
