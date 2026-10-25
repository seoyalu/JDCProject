import { Waves } from "lucide-react";
import type { ReactNode } from "react";
import s from "../../styles/App.module.css";

export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={s.empty}>
      <Waves size={38} />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
