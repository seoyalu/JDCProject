import {
  BookOpen,
  Gift,
  Heart,
  Leaf,
  MapPin,
  Plane,
  Send,
  Users,
} from "lucide-react";
import type { MissionKind } from "./catalog";
export function MissionIcon({
  kind,
  size = 24,
}: {
  kind: MissionKind;
  size?: number;
}) {
  const Icon = {
    bucket: BookOpen,
    friend: Users,
    wishlist: Gift,
    taste: Heart,
    arrival: Plane,
    visit: MapPin,
    eco: Leaf,
    share: Send,
  }[kind];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
