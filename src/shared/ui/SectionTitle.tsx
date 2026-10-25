import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import s from "../../styles/App.module.css";

export function SectionTitle({
  eyebrow,
  title,
  to,
  link = "전체보기",
}: {
  eyebrow?: string;
  title: string;
  to?: string;
  link?: string;
}) {
  return (
    <div className={s.sectionTitle}>
      <div>
        {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {to && (
        <Link className={s.textLink} to={to}>
          {link}
          <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}
