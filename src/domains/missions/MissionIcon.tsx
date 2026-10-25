import { Citrus, Leaf, Megaphone, Store } from "lucide-react";
import type { MissionKind } from "./catalog";

export function MissionIcon({
  kind,
  size = 25,
}: {
  kind: MissionKind;
  size?: number;
}) {
  const Icon = { visit: Store, vote: Megaphone, eco: Leaf, local: Citrus }[
    kind
  ];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
