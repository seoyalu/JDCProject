import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bell, BookOpen, Check, CheckCircle2, ChevronRight, Clock3, Compass, Gift, GraduationCap, Home, MapPin, QrCode, RotateCcw, ShieldCheck, ShoppingBag, Sparkles, Stamp, Ticket, UserRound, Wallet, Waves } from 'lucide-react';
import { missions, rewards, voteOptions } from './data/catalog';
import type { Reward } from './data/catalog';
import { useCampus } from './state/CampusContext';
import { date, Empty, MissionCard, MissionIcon, Modal, number, PassCard, SectionTitle } from './components/UI';
import s from './styles/App.module.css';

const nav = [{ to: '/', label: 'CAMPUS 홈', mobile: '홈', icon: Home }, { to: '/missions', label: '오늘의 미션', mobile: '미션', icon: Compass }, { to: '/benefits', label: '혜택 & 쿠폰', mobile: '혜택', icon: Gift }, { to: '/my', label: '마이 캠퍼스', mobile: '마이', icon: UserRound }];

function App() {
  const location = useLocation();
  const { storageAvailable } = useCampus();
  const [notice, setNotice] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  return <>
    <a href="#main" className={s.skipLink}>본문 바로가기</a>
    <header className={s.header}><div className={s.headerInner}>
      <Link to="/" className={s.brand} aria-label="JDC CAMPUS 홈"><span className={s.brandMark}><Waves size={25} /></span><span>JDC <b>CAMPUS</b><small>JEJU DUTY FREE</small></span></Link>
      <nav className={s.desktopNav} aria-label="주 메뉴">{nav.map(n => <NavLink end={n.to === '/'} key={n.to} to={n.to} className={({ isActive }) => isActive ? s.activeNav : ''}>{n.label}</NavLink>)}</nav>
      <div className={s.headerActions}><span className={s.demoBadge}>체험 서비스</span><button className={s.iconButton} aria-label="알림 보기" onClick={() => setNotice(true)}><Bell size={21} /><i className={s.notificationDot}/></button><Link to="/my" className={s.avatar} aria-label="김제디 마이 캠퍼스">제디</Link></div>
    </div></header>
    {!storageAvailable && <div className={s.storageWarning} role="status">브라우저 저장 공간을 사용할 수 없어 이번 체험은 새로고침하면 초기화됩니다.</div>}
    <main id="main" className={s.main}><Routes>
      <Route path="/" element={<CampusHome />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/missions/:id" element={<MissionDetail />} />
      <Route path="/missions/:id/complete" element={<MissionComplete />} />
      <Route path="/benefits" element={<Benefits />} />
      <Route path="/pass" element={<Pass />} />
      <Route path="/my" element={<MyCampus />} />
      <Route path="*" element={<NotFound />} />
    </Routes></main>
    <footer className={s.footer}><span><b>JDC CAMPUS</b> 제주에서 만나는 특별한 오늘</span><span>발표용 프로토타입 · 포인트와 쿠폰은 체험용입니다.</span></footer>
    <nav className={s.mobileNav} aria-label="모바일 메뉴">{nav.map(n => <NavLink end={n.to === '/'} key={n.to} to={n.to} className={({ isActive }) => isActive ? s.activeMobile : ''}><n.icon size={22} /><span>{n.mobile}</span></NavLink>)}</nav>
    {notice && <Modal title="CAMPUS 소식" onClose={() => setNotice(false)}><div className={s.noticeIcon}><Gift size={30} /></div><h3>제디님, 제주에 오신 걸 환영해요!</h3><p className={s.modalText}>웰컴 포인트 300P를 준비했어요. 면세점 방문 미션에 참여하고 200P를 더 모아 무료배송 쿠폰으로 교환해 보세요.</p><Link to="/missions/jdc-visit" className={s.primaryButton} onClick={() => setNotice(false)}>첫 미션 만나보기 <ArrowRight size={18} /></Link></Modal>}
  </>;
}

function CampusHome() {
  const { state } = useCampus();
  const available = state.coupons.filter(c => !c.usedAt && new Date(c.expiresAt) > new Date()).length;
  return <>
    <section className={s.hero} aria-label="대학생을 위한 특별한 제주 경험"><div className={s.heroCopy}><span className={s.heroTag}><Sparkles size={14} /> 대학생을 위한 특별한 제주 경험</span><h1>제주를 더 가깝게,<br/>오늘을 더 <span>특별하게.</span></h1><p>제주를 즐기는 나만의 방법.<br/>미션으로 추억을 쌓고, 특별한 혜택을 만나보세요.</p><Link to="/missions" className={s.heroButton}>제디와 미션 시작하기 <ArrowRight size={17} /></Link><span className={s.heroCaption}>MY JEJU, MY CAMPUS</span></div><div className={s.heroSpeech}>안녕! 나는 제디야 <span>함께 제주를 만나볼까?</span></div><div className={s.heroLocation}><MapPin size={13} /> JEJU ISLAND, KOREA</div></section>
    <section className={s.overview} aria-label="내 CAMPUS 현황"><PassCard compact /><div className={s.overviewStats}>
      <div className={s.welcomeLine}><span>반가워요, <strong>제디님!</strong> <span className={s.waveEmoji}>✦</span></span><Link to="/my">내 활동 보기 <ChevronRight size={14} /></Link></div>
      <div className={s.statsGrid}><Link to="/my?tab=points"><span className={`${s.statIcon} ${s.orange}`}><Wallet size={22} /></span><span className={s.statLabel}>보유 포인트</span><strong key={state.points} className={s.countUp}>{number(state.points)}<small>P</small></strong></Link><Link to="/pass"><span className={`${s.statIcon} ${s.blue}`}><Stamp size={22} /></span><span className={s.statLabel}>나의 스탬프</span><strong>{state.completed.length}<small>/ {missions.length}</small></strong></Link><Link to="/benefits?tab=wallet"><span className={`${s.statIcon} ${s.green}`}><Ticket size={22} /></span><span className={s.statLabel}>보유 쿠폰</span><strong>{available}<small>장</small></strong></Link></div>
      <div className={s.nextTip}><Sparkles size={15} /><span>{state.completed.length ? '차곡차곡 쌓이는 나만의 제주 이야기' : '첫 미션을 완료하면 200P를 더 받을 수 있어요!'}</span><Link to={state.completed.length ? '/pass' : '/missions/jdc-visit'} aria-label="추천 활동 확인"><ArrowRight size={16} /></Link></div>
    </div></section>
    <div className={s.homeGrid}><section><SectionTitle eyebrow="LET’S EXPLORE" title="오늘, 어떤 제주를 만날까요?" to="/missions" /><div className={s.missionList}>{missions.slice(0, 3).map(m => <MissionCard key={m.id} mission={m} />)}</div><Link to="/pass" className={s.passportBanner}><span className={s.passportSymbol}><BookOpen size={30} /></span><span><strong>제주의 순간을 차곡차곡</strong><small>나만의 스탬프 여권을 채워보세요.</small></span><ArrowUpRightIcon /></Link></section>
      <section><SectionTitle eyebrow="JUST FOR CAMPUS" title="대학생이라 더 좋은 혜택" to="/benefits" /><div className={s.featuredReward}><div className={s.rewardTopline}><span>WELCOME BENEFIT</span><Ticket size={24} /></div><span className={s.rewardKicker}>제주에서 만난 설렘을 집까지</span><h3>배송비는 <span>0원,</span><br/>즐거움은 그대로.</h3><p>500P로 무료배송 쿠폰을 만나보세요.</p><Link to="/benefits?reward=shipping" className={s.rewardLink}>쿠폰 교환하기 <ArrowRight size={17} /></Link><div className={s.rewardDecoration}><ShoppingBag size={77} strokeWidth={1.2} /><span>FOR YOU</span></div></div><div className={s.smallBenefit}><span className={`${s.statIcon} ${s.orange}`}><GraduationCap size={25}/></span><div><strong>대학생의 제주, 더 특별하게</strong><p>인증된 대학생만을 위한 CAMPUS 혜택</p></div><ShieldCheck size={20} /></div><Link to="/missions/brand-vote" className={s.voteBanner}><span>YOUR PICK, OUR NEXT</span><strong>다음에 만나고 싶은 브랜드는?</strong><p>취향을 알려주고 50P 받기 <ArrowRight size={15} /></p></Link></section></div>
    <section className={s.steps}><div><span className={s.eyebrow}>HOW TO CAMPUS</span><h2>즐기는 만큼, 혜택이 되는 제주</h2></div><ol><li><span>01</span><p>마음에 드는<br/><strong>미션을 찾고</strong></p></li><li><span>02</span><p>제주를 즐기며<br/><strong>포인트를 모으고</strong></p></li><li><span>03</span><p>나를 위한<br/><strong>혜택으로 바꿔요</strong></p></li></ol></section>
  </>;
}

function ArrowUpRightIcon() { return <ArrowRight size={20} style={{ transform: 'rotate(-40deg)' }} />; }

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className={s.pageHeading}><span className={s.eyebrow}>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;
}

function Missions() {
  const { state } = useCampus();
  const [filter, setFilter] = useState('전체');
  const items = missions.filter(m => filter === '완료' ? state.completed.includes(m.id) : filter === '진행 중' ? !state.completed.includes(m.id) : filter === '추천' ? m.recommended && !state.completed.includes(m.id) : true);
  return <div className={s.page}><PageHeading eyebrow="EXPLORE JEJU" title="제주를 즐기는 작은 미션" description="새로운 경험 하나, 쌓이는 혜택 하나. 제디와 함께 시작해요."/><div className={s.missionPageBanner}><span>오늘의 제주가<br/><strong>내일의 추억이 되도록.</strong></span><p>미션을 완료하고 포인트와 스탬프를 모아보세요.</p></div><div className={s.filterBar} aria-label="미션 필터">{['전체', '진행 중', '완료', '추천'].map(f => <button aria-pressed={filter === f} className={filter === f ? s.selectedFilter : ''} onClick={() => setFilter(f)} key={f}>{f}{f === '완료' && <small>{state.completed.length}</small>}</button>)}</div><div className={s.listMeta}><span>{filter} 미션 <strong>{items.length}</strong></span><small>체험 기간 내 미션별 1회 참여</small></div><div className={s.missionPageGrid}>{items.map(m => <MissionCard key={m.id} mission={m} />)}</div>{!items.length && <Empty title={filter === '완료' ? '첫 번째 추억을 기다리고 있어요' : '이곳의 미션을 모두 만나봤어요'}>{filter === '완료' ? '미션에 참여하면 완료한 활동이 이곳에 모여요.' : '전체 탭에서 다른 미션을 살펴보세요.'}</Empty>}<div className={s.infoBox}><ShieldCheck size={21}/><p>이곳은 발표용 체험 공간이에요. 현장 방문 대신 <strong>데모 인증</strong>으로 미션 흐름을 경험할 수 있어요.</p></div></div>;
}

function MissionDetail() {
  const { id } = useParams();
  const mission = missions.find(m => m.id === id);
  const { state, dispatch } = useCampus();
  const [scan, setScan] = useState(false);
  const [vote, setVote] = useState('');
  const navigate = useNavigate();
  if (!mission) return <NotFound />;
  const done = state.completed.includes(mission.id);
  function complete() {
    if (!mission || done) return;
    dispatch({ type: 'complete', missionId: mission.id, at: new Date().toISOString(), vote });
    navigate(`/missions/${mission.id}/complete`, { replace: true });
  }
  return <div className={s.detailPage}><Link className={s.backLink} to="/missions"><ArrowLeft size={17}/> 미션 목록</Link><div className={`${s.detailIllustration} ${s[mission.kind]}`}><span className={s.detailIllustrationCircle}><MissionIcon kind={mission.kind} size={64}/></span><span className={s.detailFloating}>+{mission.points}P</span><Sparkles className={s.detailSparkle} size={30}/></div><div className={s.detailContent}><div className={s.detailTags}><span>{mission.kind === 'vote' ? '참여 미션' : '제주 / JDC 활동'}</span><span>{done ? '참여 완료' : '참여 가능'}</span></div><h1>{mission.title}</h1><p className={s.detailDescription}>{mission.description}</p><div className={s.detailFacts}><span><MapPin size={18}/>{mission.location}</span><span><Clock3 size={18}/>{mission.duration} 소요</span></div><div className={s.missionRewards}><div><Wallet size={22}/><span>획득 포인트<strong>+{mission.points}P</strong></span></div><div><Stamp size={22}/><span>획득 스탬프<strong>{mission.stamp}</strong></span></div></div>
      {mission.kind === 'vote' && !done && <fieldset className={s.voteOptions}><legend>어떤 브랜드를 만나고 싶나요?</legend>{voteOptions.map(option => <label key={option} className={vote === option ? s.selectedOption : ''}><input type="radio" name="brand" value={option} checked={vote === option} onChange={() => setVote(option)}/>{option}<CheckCircle2 size={19}/></label>)}</fieldset>}
      {done && mission.kind === 'vote' && <p className={s.infoBox}>나의 선택: {state.votes[mission.id]}</p>}
      <div className={s.detailNotes}><h3>참여 전 확인해 주세요</h3><ul><li>체험 기간 내 미션별 1회 참여할 수 있어요.</li><li>미션 완료 시 포인트와 스탬프가 함께 지급돼요.</li><li>발표용 데모이며 실제 방문·대학생 인증과 연결되지 않아요.</li></ul></div>
      {done ? <Link to="/pass" className={s.primaryButton}><CheckCircle2 size={18}/> 완료한 스탬프 보기</Link> : <button className={s.primaryButton} disabled={mission.kind === 'vote' && !vote} onClick={() => mission.kind === 'vote' ? complete() : setScan(true)}>{mission.kind === 'vote' ? '투표하고 포인트 받기' : <><QrCode size={19}/> 방문 인증 시작하기</>}<ArrowRight size={18}/></button>}
    </div>{scan && <Modal title="미션 방문 인증" onClose={() => setScan(false)}><div className={s.scanFrame}><QrCode size={105} strokeWidth={1.1}/><span/></div><h3 className={s.centerText}>제주의 순간을 기록해요</h3><p className={s.modalText}>실제 서비스에서는 현장 QR을 스캔해요.<br/>지금은 아래 버튼으로 인증을 체험해 보세요.</p><button className={s.primaryButton} onClick={complete}>데모 인증하기 <Check size={19}/></button><p className={s.smallPrint}>카메라 권한이나 현장 방문이 필요하지 않아요.</p></Modal>}</div>;
}

function MissionComplete() {
  const { id } = useParams();
  const { state } = useCampus();
  const mission = missions.find(m => m.id === id);
  if (!mission || !state.completed.includes(mission.id)) return <NotFound />;
  return <div className={s.successPage}><div className={s.successArtwork}><div className={s.successSeal}><Check size={49}/></div><span className={s.confettiOne}>✦</span><span className={s.confettiTwo}>✦</span><span className={s.confettiThree}>●</span></div><span className={s.eyebrow}>A LITTLE ADVENTURE, A BIG SMILE</span><h1>제주와 한 걸음 더 가까워졌어요!</h1><p>{mission.title} 미션을 완료했어요.</p><div className={s.earnedPoints}>+{mission.points}<span>P</span></div><div className={s.newStamp}><span className={`${s.missionIcon} ${s[mission.kind]}`}><MissionIcon kind={mission.kind}/></span><div><small>새로운 스탬프 획득</small><strong>{mission.stamp}</strong></div><Stamp size={24}/></div><div className={s.balanceLine}>현재 보유 포인트 <strong>{number(state.points)}P</strong></div><Link className={s.primaryButton} to="/benefits">포인트로 혜택 만나기 <ArrowRight size={18}/></Link><Link className={s.secondaryButton} to="/pass">나의 PASS와 스탬프 보기</Link><Link className={s.textLink} to="/missions">다른 미션 둘러보기 <ChevronRight size={15}/></Link></div>;
}

function Benefits() {
  const { state, dispatch } = useCampus();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'wallet' ? 'wallet' : 'exchange';
  const [selected, setSelected] = useState<Reward | null>(null);
  const [issued, setIssued] = useState(false);
  const [using, setUsing] = useState<string | null>(null);
  const exchangeLock = useRef(false);
  const focusReward = params.get('reward');
  const available = state.coupons.filter(c => !c.usedAt && new Date(c.expiresAt) > new Date()).length;
  function exchange() {
    if (!selected || state.points < selected.points || exchangeLock.current) return;
    exchangeLock.current = true;
    dispatch({ type: 'exchange', rewardId: selected.id, id: crypto.randomUUID(), at: new Date().toISOString() });
    setSelected(null); setIssued(true);
  }
  return <div className={s.page}><PageHeading eyebrow="A GIFT FOR YOUR TODAY" title="즐긴 만큼 돌아오는 혜택" description="제주에서 쌓은 포인트를 나를 위한 선물로 바꿔보세요."/><div className={s.balanceBanner}><span><Wallet size={24}/> 교환 가능한 포인트</span><strong>{number(state.points)}<small>P</small></strong><Link to="/missions">포인트 모으기 <ArrowRight size={16}/></Link></div><div className={s.tabBar}><button className={tab === 'exchange' ? s.activeTab : ''} onClick={() => setParams({})}>포인트 교환</button><button className={tab === 'wallet' ? s.activeTab : ''} onClick={() => setParams({ tab: 'wallet' })}>내 쿠폰함 <span>{available}</span></button></div>
    {tab === 'exchange' ? <><SectionTitle title="대학생 전용 쿠폰"/><div className={s.couponGrid}>{rewards.map(reward => <article key={reward.id} className={`${s.coupon} ${s[reward.theme]} ${focusReward === reward.id ? s.highlightCoupon : ''}`}><div className={s.couponInner}><div className={s.couponBrand}>JDC DUTY FREE <Ticket size={20}/></div><h2>{reward.headline}</h2><h3>{reward.title}</h3><p>{reward.detail}</p><span className={s.couponValidity}>발급일로부터 30일 · 체험용</span></div><div className={s.couponBottom}><strong>{number(reward.points)}P</strong><button disabled={state.points < reward.points} onClick={() => { exchangeLock.current = false; setSelected(reward); }}>{state.points < reward.points ? `${number(reward.points - state.points)}P 더 필요` : '교환하기'}{state.points >= reward.points && <ArrowRight size={15}/>}</button></div></article>)}</div><div className={s.infoBox}><Ticket size={23}/><p>교환한 쿠폰은 <strong>내 쿠폰함</strong>에 보관돼요. 쿠폰 조건과 포인트는 발표용 예시이며 실제 결제에는 사용할 수 없어요.</p></div></> : <>{!state.coupons.length ? <><Empty title="첫 번째 혜택을 기다리고 있어요">모은 포인트로 쿠폰을 교환하면 이곳에 담아드려요.</Empty><button className={s.secondaryButton} onClick={() => setParams({})}>교환할 쿠폰 둘러보기</button></> : <div className={s.walletList}>{state.coupons.map(c => { const reward = rewards.find(r => r.id === c.rewardId)!; const expired = new Date(c.expiresAt) <= new Date(); return <article key={c.id} className={`${s.walletCoupon} ${c.usedAt || expired ? s.usedCoupon : ''}`}><span className={`${s.statIcon} ${s[reward.theme]}`}><Ticket size={27}/></span><div><span className={s.eyebrow}>JDC CAMPUS</span><h3>{reward.title}</h3><p>{date(c.issuedAt)} 발급 · {date(c.expiresAt)}까지</p><small>쿠폰 번호 {c.id.slice(0, 8).toUpperCase()}</small></div><button className={s.walletUseButton} disabled={!!c.usedAt || expired} onClick={() => setUsing(c.id)}>{c.usedAt ? '사용 완료' : expired ? '기간 만료' : '사용 체험'}</button></article>; })}</div>}<p className={s.smallPrint}>데모 사용을 완료한 쿠폰은 사용 완료 상태로 보관돼요.</p></>}
    {selected && <Modal title="쿠폰을 교환할까요?" onClose={() => setSelected(null)}><div className={s.noticeIcon}><Ticket size={32}/></div><h3 className={s.centerText}>{selected.title}</h3><div className={s.exchangeSummary}><p>사용 포인트 <strong>−{number(selected.points)}P</strong></p><p>교환 후 잔액 <strong>{number(state.points - selected.points)}P</strong></p></div><p className={s.smallPrint}>발급일부터 30일간 유효한 체험용 쿠폰이에요.</p><button className={s.primaryButton} onClick={exchange} disabled={state.points < selected.points}>{number(selected.points)}P로 교환하기</button></Modal>}
    {issued && <Modal title="쿠폰이 도착했어요!" onClose={() => setIssued(false)}><div className={s.noticeIcon}><CheckCircle2 size={35}/></div><p className={s.modalText}>제주에서 모은 즐거움이 혜택이 되었어요.<br/>내 쿠폰함에서 새 쿠폰을 확인해 보세요.</p><button className={s.primaryButton} onClick={() => { setIssued(false); setParams({ tab: 'wallet' }); }}>내 쿠폰함 열기 <ArrowRight size={18}/></button></Modal>}
    {using && <Modal title="쿠폰 사용 체험" onClose={() => setUsing(null)}><div className={s.noticeIcon}><ShoppingBag size={32}/></div><p className={s.modalText}>실제 서비스에서는 주문 또는 매장 결제 시 쿠폰을 적용해요. 아래 버튼으로 사용 완료 상태를 체험할 수 있어요.</p><button className={s.primaryButton} onClick={() => { dispatch({ type: 'useCoupon', id: using, at: new Date().toISOString() }); setUsing(null); }}>데모 사용 완료하기</button></Modal>}
  </div>;
}

function Pass() {
  const { state } = useCampus();
  return <div className={s.page}><PageHeading eyebrow="MY CAMPUS PASS" title="나의 제주를 담은 PASS" description="대학생의 특별한 자격, 그리고 차곡차곡 쌓이는 여행의 기록."/><div className={s.passPageGrid}><section><PassCard/><div className={s.passInfo}><span><ShieldCheck size={18}/>대학생 인증 완료</span><p>제주대학교 · 김제디</p><small>체험 계정 · 인증 기간 2026.10.25 – 2027.10.24</small></div><div className={s.passBalance}><span>보유 포인트</span><strong>{number(state.points)}P</strong><Link to="/my?tab=points">내역 보기 <ChevronRight size={14}/></Link></div></section><section className={s.passport}><div className={s.passportHeader}><BookOpen size={25}/><div><span className={s.eyebrow}>MY JEJU PASSPORT</span><h2>제디의 스탬프 여권</h2></div><strong>{state.completed.length}<small> / {missions.length}</small></strong></div><div className={s.stampGrid}>{missions.map(m => { const done = state.completed.includes(m.id); return <Link key={m.id} to={`/missions/${m.id}`} className={`${s.stampItem} ${done ? s.earnedStamp : ''}`}><span><MissionIcon kind={m.kind} size={32}/>{done && <CheckCircle2 size={18}/>}</span><strong>{m.stamp}</strong><small>{done ? '수집 완료' : '미션으로 만나기'}</small></Link>; })}</div><p className={s.passportNote}>스탬프는 사용해도 사라지지 않는 나만의 제주 추억이에요.</p></section></div><Link to="/missions" className={s.primaryButton}>다음 제주 이야기 만나기 <ArrowRight size={18}/></Link></div>;
}

function MyCampus() {
  const { state, dispatch } = useCampus();
  const [params, setParams] = useSearchParams();
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();
  const tab = params.get('tab') === 'points' ? 'points' : 'activity';
  const positive = state.history.filter(h => h.points > 0).reduce((sum, h) => sum + h.points, 0);
  return <div className={s.page}><PageHeading eyebrow="MY CAMPUS" title="제디님의 제주 이야기" description="즐겁게 참여한 순간과 나에게 돌아온 혜택을 한곳에서."/><div className={s.profileCard}><span className={s.profileAvatar}><Waves size={34}/></span><div><h2>김제디 <span>새내기</span></h2><p>제주대학교 <ShieldCheck size={15}/></p></div><Link to="/pass" className={s.textLink}>PASS 보기 <ChevronRight size={16}/></Link></div><div className={s.myStats}><div><span>보유 포인트</span><strong>{number(state.points)}P</strong></div><div><span>누적 적립</span><strong>{number(positive)}P</strong></div><div><span>완료한 미션</span><strong>{state.completed.length}개</strong></div></div><div className={s.tabBar}><button className={tab === 'activity' ? s.activeTab : ''} onClick={() => setParams({})}>내 활동</button><button className={tab === 'points' ? s.activeTab : ''} onClick={() => setParams({ tab: 'points' })}>포인트 내역</button></div>{tab === 'activity' ? <>{state.completed.length ? <div className={s.missionList}>{missions.filter(m => state.completed.includes(m.id)).map(m => <MissionCard key={m.id} mission={m}/>)}</div> : <Empty title="제주 이야기의 첫 페이지">오늘의 미션에 참여하고 나만의 기록을 남겨보세요.</Empty>}<Link to="/missions" className={s.secondaryButton}>미션 둘러보기 <ArrowRight size={17}/></Link></> : <div className={s.history}>{state.history.map(h => <div className={s.historyItem} key={h.id}><span className={`${s.statIcon} ${h.points > 0 ? s.blue : s.orange}`}>{h.points > 0 ? <Wallet size={21}/> : <Ticket size={21}/>}</span><div><strong>{h.label}</strong><small>{date(h.at)}</small></div><b className={h.points > 0 ? s.positive : s.negative}>{h.points > 0 ? '+' : ''}{number(h.points)}P</b></div>)}</div>}<div className={s.demoSettings}><div><h3>처음부터 다시 만나고 싶다면</h3><p>이 브라우저의 체험 기록을 지우고 300P로 다시 시작해요.</p></div><button onClick={() => setReset(true)}><RotateCcw size={16}/> 체험 초기화</button></div>{reset && <Modal title="체험을 처음부터 시작할까요?" onClose={() => setReset(false)}><p className={s.modalText}>이 브라우저의 미션, 스탬프, 쿠폰, 포인트 내역이 초기화되고 웰컴 포인트 300P로 돌아갑니다.</p><button className={s.primaryButton} onClick={() => { dispatch({ type: 'reset' }); setReset(false); navigate('/'); }}>초기화하고 홈으로</button><button className={s.secondaryButton} onClick={() => setReset(false)}>계속 체험하기</button></Modal>}</div>;
}

function NotFound() { return <div className={s.page}><Empty title="이 페이지는 아직 제주 여행 중이에요">주소를 다시 확인하거나 CAMPUS 홈으로 돌아가 주세요.</Empty><Link className={s.primaryButton} to="/">CAMPUS 홈으로</Link></div>; }

export default App;
