import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  QrCode,
  Sparkles,
  Stamp,
  Wallet,
} from "lucide-react";
import { missions, voteOptions } from "./catalog";
import { useCampus } from "../../app/state/CampusContext";
import { MissionIcon } from "./MissionIcon";
import { Modal } from "../../shared/ui/Modal";
import { NotFound } from "../../shared/ui/NotFound";
import s from "../../styles/App.module.css";

export function MissionDetail() {
  const { id } = useParams();
  const mission = missions.find((m) => m.id === id);
  const { state, dispatch } = useCampus();
  const [scan, setScan] = useState(false);
  const [vote, setVote] = useState("");
  const navigate = useNavigate();
  if (!mission) return <NotFound />;
  const done = state.completed.includes(mission.id);
  function complete() {
    if (!mission || done) return;
    dispatch({
      type: "complete",
      missionId: mission.id,
      at: new Date().toISOString(),
      vote,
    });
    navigate(`/missions/${mission.id}/complete`, { replace: true });
  }
  return (
    <div className={s.detailPage}>
      <Link className={s.backLink} to="/missions">
        <ArrowLeft size={17} /> 미션 목록
      </Link>
      <div className={`${s.detailIllustration} ${s[mission.kind]}`}>
        <span className={s.detailIllustrationCircle}>
          <MissionIcon kind={mission.kind} size={64} />
        </span>
        <span className={s.detailFloating}>+{mission.points}P</span>
        <Sparkles className={s.detailSparkle} size={30} />
      </div>
      <div className={s.detailContent}>
        <div className={s.detailTags}>
          <span>
            {mission.kind === "vote" ? "참여 미션" : "제주 / JDC 활동"}
          </span>
          <span>{done ? "참여 완료" : "참여 가능"}</span>
        </div>
        <h1>{mission.title}</h1>
        <p className={s.detailDescription}>{mission.description}</p>
        <div className={s.detailFacts}>
          <span>
            <MapPin size={18} />
            {mission.location}
          </span>
          <span>
            <Clock3 size={18} />
            {mission.duration} 소요
          </span>
        </div>
        <div className={s.missionRewards}>
          <div>
            <Wallet size={22} />
            <span>
              획득 포인트<strong>+{mission.points}P</strong>
            </span>
          </div>
          <div>
            <Stamp size={22} />
            <span>
              획득 스탬프<strong>{mission.stamp}</strong>
            </span>
          </div>
        </div>
        {mission.kind === "vote" && !done && (
          <fieldset className={s.voteOptions}>
            <legend>어떤 브랜드를 만나고 싶나요?</legend>
            {voteOptions.map((option) => (
              <label
                key={option}
                className={vote === option ? s.selectedOption : ""}
              >
                <input
                  type="radio"
                  name="brand"
                  value={option}
                  checked={vote === option}
                  onChange={() => setVote(option)}
                />
                {option}
                <CheckCircle2 size={19} />
              </label>
            ))}
          </fieldset>
        )}
        {done && mission.kind === "vote" && (
          <p className={s.infoBox}>나의 선택: {state.votes[mission.id]}</p>
        )}
        <div className={s.detailNotes}>
          <h3>참여 전 확인해 주세요</h3>
          <ul>
            <li>체험 기간 내 미션별 1회 참여할 수 있어요.</li>
            <li>미션 완료 시 포인트와 스탬프가 함께 지급돼요.</li>
            <li>발표용 데모이며 실제 방문·대학생 인증과 연결되지 않아요.</li>
          </ul>
        </div>
        {done ? (
          <Link to="/pass" className={s.primaryButton}>
            <CheckCircle2 size={18} /> 완료한 스탬프 보기
          </Link>
        ) : (
          <button
            className={s.primaryButton}
            disabled={mission.kind === "vote" && !vote}
            onClick={() =>
              mission.kind === "vote" ? complete() : setScan(true)
            }
          >
            {mission.kind === "vote" ? (
              "투표하고 포인트 받기"
            ) : (
              <>
                <QrCode size={19} /> 방문 인증 시작하기
              </>
            )}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
      {scan && (
        <Modal title="미션 방문 인증" onClose={() => setScan(false)}>
          <div className={s.scanFrame}>
            <QrCode size={105} strokeWidth={1.1} />
            <span />
          </div>
          <h3 className={s.centerText}>제주의 순간을 기록해요</h3>
          <p className={s.modalText}>
            실제 서비스에서는 현장 QR을 스캔해요.
            <br />
            지금은 아래 버튼으로 인증을 체험해 보세요.
          </p>
          <button className={s.primaryButton} onClick={complete}>
            데모 인증하기 <Check size={19} />
          </button>
          <p className={s.smallPrint}>
            카메라 권한이나 현장 방문이 필요하지 않아요.
          </p>
        </Modal>
      )}
    </div>
  );
}
