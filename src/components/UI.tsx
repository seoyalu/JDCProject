import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, ChevronRight, Citrus, Leaf, Megaphone, Store, X, Waves, ShieldCheck } from 'lucide-react';
import type { Mission, MissionKind } from '../data/catalog';
import { useCampus } from '../state/CampusContext';
import s from '../styles/App.module.css';

export const number = (n: number) => n.toLocaleString('ko-KR');
export const date = (value: string) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' }).format(new Date(value));

export function MissionIcon({ kind, size = 25 }: { kind: MissionKind; size?: number }) {
  const Icon = { visit: Store, vote: Megaphone, eco: Leaf, local: Citrus }[kind];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function SectionTitle({ eyebrow, title, to, link = '전체보기' }: { eyebrow?: string; title: string; to?: string; link?: string }) {
  return <div className={s.sectionTitle}><div>{eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}<h2>{title}</h2></div>{to && <Link className={s.textLink} to={to}>{link}<ChevronRight size={15} /></Link>}</div>;
}

export function PassCard({ compact = false }: { compact?: boolean }) {
  const { state } = useCampus();
  return <Link to="/pass" className={`${s.passCard} ${compact ? s.compactPass : ''}`} aria-label="김제디의 대학생 PASS 자세히 보기">
    <div className={s.passTop}><span>JDC CAMPUS</span><span><ShieldCheck size={14} /> 대학생 인증 완료</span></div>
    <div className={s.passHeading}><h2>대학생 PASS</h2>{compact ? <strong className={s.passPoints}>{number(state.points)}<small>P</small></strong> : <Waves size={39} strokeWidth={1.3} />}</div>
    <div className={s.passPerson}><span>제주대학교 <strong>김제디</strong></span><span className={s.passPill}>새내기</span></div>
    <div className={s.barcodeRow}><div className={s.barcode} aria-hidden="true"/><span>2026 0318 7790</span><ArrowUpRight size={16} /></div>
  </Link>;
}

export function MissionCard({ mission }: { mission: Mission }) {
  const { state } = useCampus();
  const done = state.completed.includes(mission.id);
  return <Link to={`/missions/${mission.id}`} className={`${s.missionCard} ${s[mission.kind]}`}>
    <span className={s.missionIcon}><MissionIcon kind={mission.kind} /></span>
    <div className={s.missionBody}><div className={s.missionHeading}><h3>{mission.title}</h3><span className={s.points}>+{mission.points}P</span></div><p>{mission.short}</p>
      <div className={s.progressRow}><span className={s.progress}><span style={{ width: done ? '100%' : '0%' }} /></span><small>{done ? '1' : '0'} / 1</small></div>
    </div><span className={done ? s.doneIcon : s.cardArrow}>{done ? <Check size={18} /> : <ChevronRight size={20} />}</span>
  </Link>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const nodes = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, [tabindex="0"]');
      if (!nodes?.length) { event.preventDefault(); return; }
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handle);
    return () => { document.body.style.overflow = original; document.removeEventListener('keydown', handle); previous?.focus(); };
  }, []);
  return <div className={s.modalBackdrop} onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div ref={ref} className={s.modal} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}><div className={s.modalHeading}><h2 id={titleId}>{title}</h2><button className={s.iconButton} onClick={onClose} aria-label="닫기"><X size={22} /></button></div>{children}</div></div>;
}

export function Empty({ title, children }: { title: string; children: ReactNode }) {
  return <div className={s.empty}><Waves size={38} /><h3>{title}</h3><p>{children}</p></div>;
}
