import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BookOpen } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { MapPin } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Stamp } from "lucide-react";
import { Ticket } from "lucide-react";
import { Wallet } from "lucide-react";
import { missions } from "../missions/catalog";
import { useCampus } from "../../app/state/CampusContext";
import { MissionCard } from "../missions/MissionCard";
import { number } from "../../shared/lib/format";
import { PassCard } from "../pass/PassCard";
import { SectionTitle } from "../../shared/ui/SectionTitle";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import s from "../../styles/App.module.css";

export function CampusHome() {
  const { state } = useCampus();
  const available = state.coupons.filter(
    (c) => !c.usedAt && new Date(c.expiresAt) > new Date(),
  ).length;
  return (
    <>
      <section className={s.hero} aria-label="대학생을 위한 특별한 제주 경험">
        <div className={s.heroCopy}>
          <span className={s.heroTag}>
            <Sparkles size={14} /> 대학생을 위한 특별한 제주 경험
          </span>
          <h1>
            제주를 더 가깝게,
            <br />
            오늘을 더 <span>특별하게.</span>
          </h1>
          <p>
            제주를 즐기는 나만의 방법.
            <br />
            미션으로 추억을 쌓고, 특별한 혜택을 만나보세요.
          </p>
          <Link to="/missions" className={s.heroButton}>
            제디와 미션 시작하기 <ArrowRight size={17} />
          </Link>
          <span className={s.heroCaption}>MY JEJU, MY CAMPUS</span>
        </div>
        <div className={s.heroSpeech}>
          안녕! 나는 제디야 <span>함께 제주를 만나볼까?</span>
        </div>
        <div className={s.heroLocation}>
          <MapPin size={13} /> JEJU ISLAND, KOREA
        </div>
      </section>
      <section className={s.overview} aria-label="내 CAMPUS 현황">
        <PassCard compact />
        <div className={s.overviewStats}>
          <div className={s.welcomeLine}>
            <span>
              반가워요, <strong>제디님!</strong>{" "}
              <span className={s.waveEmoji}>✦</span>
            </span>
            <Link to="/my">
              내 활동 보기 <ChevronRight size={14} />
            </Link>
          </div>
          <div className={s.statsGrid}>
            <Link to="/my?tab=points">
              <span className={`${s.statIcon} ${s.orange}`}>
                <Wallet size={22} />
              </span>
              <span className={s.statLabel}>보유 포인트</span>
              <strong key={state.points} className={s.countUp}>
                {number(state.points)}
                <small>P</small>
              </strong>
            </Link>
            <Link to="/pass">
              <span className={`${s.statIcon} ${s.blue}`}>
                <Stamp size={22} />
              </span>
              <span className={s.statLabel}>나의 스탬프</span>
              <strong>
                {state.completed.length}
                <small>/ {missions.length}</small>
              </strong>
            </Link>
            <Link to="/benefits?tab=wallet">
              <span className={`${s.statIcon} ${s.green}`}>
                <Ticket size={22} />
              </span>
              <span className={s.statLabel}>보유 쿠폰</span>
              <strong>
                {available}
                <small>장</small>
              </strong>
            </Link>
          </div>
          <div className={s.nextTip}>
            <Sparkles size={15} />
            <span>
              {state.completed.length
                ? "차곡차곡 쌓이는 나만의 제주 이야기"
                : "첫 미션을 완료하면 200P를 더 받을 수 있어요!"}
            </span>
            <Link
              to={state.completed.length ? "/pass" : "/missions/jdc-visit"}
              aria-label="추천 활동 확인"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <div className={s.homeGrid}>
        <section>
          <SectionTitle
            eyebrow="LET’S EXPLORE"
            title="오늘, 어떤 제주를 만날까요?"
            to="/missions"
          />
          <div className={s.missionList}>
            {missions.slice(0, 3).map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
          <Link to="/pass" className={s.passportBanner}>
            <span className={s.passportSymbol}>
              <BookOpen size={30} />
            </span>
            <span>
              <strong>제주의 순간을 차곡차곡</strong>
              <small>나만의 스탬프 여권을 채워보세요.</small>
            </span>
            <ArrowUpRightIcon />
          </Link>
        </section>
        <section>
          <SectionTitle
            eyebrow="JUST FOR CAMPUS"
            title="대학생이라 더 좋은 혜택"
            to="/benefits"
          />
          <div className={s.featuredReward}>
            <div className={s.rewardTopline}>
              <span>WELCOME BENEFIT</span>
              <Ticket size={24} />
            </div>
            <span className={s.rewardKicker}>제주에서 만난 설렘을 집까지</span>
            <h3>
              배송비는 <span>0원,</span>
              <br />
              즐거움은 그대로.
            </h3>
            <p>500P로 무료배송 쿠폰을 만나보세요.</p>
            <Link to="/benefits?reward=shipping" className={s.rewardLink}>
              쿠폰 교환하기 <ArrowRight size={17} />
            </Link>
            <div className={s.rewardDecoration}>
              <ShoppingBag size={77} strokeWidth={1.2} />
              <span>FOR YOU</span>
            </div>
          </div>
          <div className={s.smallBenefit}>
            <span className={`${s.statIcon} ${s.orange}`}>
              <GraduationCap size={25} />
            </span>
            <div>
              <strong>대학생의 제주, 더 특별하게</strong>
              <p>인증된 대학생만을 위한 CAMPUS 혜택</p>
            </div>
            <ShieldCheck size={20} />
          </div>
          <Link to="/missions/brand-vote" className={s.voteBanner}>
            <span>YOUR PICK, OUR NEXT</span>
            <strong>다음에 만나고 싶은 브랜드는?</strong>
            <p>
              취향을 알려주고 50P 받기 <ArrowRight size={15} />
            </p>
          </Link>
        </section>
      </div>
      <section className={s.steps}>
        <div>
          <span className={s.eyebrow}>HOW TO CAMPUS</span>
          <h2>즐기는 만큼, 혜택이 되는 제주</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <p>
              마음에 드는
              <br />
              <strong>미션을 찾고</strong>
            </p>
          </li>
          <li>
            <span>02</span>
            <p>
              제주를 즐기며
              <br />
              <strong>포인트를 모으고</strong>
            </p>
          </li>
          <li>
            <span>03</span>
            <p>
              나를 위한
              <br />
              <strong>혜택으로 바꿔요</strong>
            </p>
          </li>
        </ol>
      </section>
    </>
  );
}
