export type MissionKind = "visit" | "vote" | "eco" | "local";
export interface Mission {
  id: string;
  title: string;
  short: string;
  description: string;
  points: number;
  kind: MissionKind;
  location: string;
  duration: string;
  stamp: string;
  recommended: boolean;
}

export const missions: Mission[] = [
  {
    id: "jdc-visit",
    title: "JDC 면세점 방문",
    short: "여행의 설렘에, 특별한 혜택을 더해요.",
    description:
      "제주 여행의 시작과 끝, JDC 면세점에 들러보세요. 매장에 비치된 QR을 인증하면 포인트와 나만의 제주 스탬프를 받을 수 있어요.",
    points: 200,
    kind: "visit",
    location: "제주국제공항 JDC 지정면세점",
    duration: "약 1분",
    stamp: "설레는 제주",
    recommended: true,
  },
  {
    id: "brand-vote",
    title: "내가 고르는 다음 브랜드",
    short: "만나고 싶은 브랜드에 한 표를 보내주세요.",
    description:
      "JDC 면세점에서 가장 만나고 싶은 브랜드 카테고리를 골라주세요. 여러분의 취향이 더 즐거운 쇼핑을 만들어요.",
    points: 50,
    kind: "vote",
    location: "어디서나 참여 가능",
    duration: "약 30초",
    stamp: "취향 발견",
    recommended: true,
  },
  {
    id: "green-jeju",
    title: "제주를 지키는 작은 실천",
    short: "제주 바다를 위한 친환경 미션에 참여해요.",
    description:
      "제주 해변 정화 캠페인에서 작은 실천을 함께해요. 캠페인 참여 후 운영 부스의 QR로 활동을 인증해 주세요.",
    points: 150,
    kind: "eco",
    location: "제주 해변 캠페인 운영 부스",
    duration: "약 20분",
    stamp: "초록빛 발자국",
    recommended: false,
  },
  {
    id: "local-brand",
    title: "제주 로컬 브랜드 만나기",
    short: "제주에서만 만나는 이야기를 찾아보세요.",
    description:
      "제주의 자연과 사람을 담은 로컬 브랜드를 만나보세요. 제휴 공간을 둘러본 후 현장 QR을 인증하면 체험이 기록돼요.",
    points: 200,
    kind: "local",
    location: "제주 로컬 브랜드 제휴 공간",
    duration: "약 10분",
    stamp: "로컬 탐험가",
    recommended: false,
  },
];

export const voteOptions = [
  "뷰티 · 향수",
  "패션 · 액세서리",
  "제주 로컬 브랜드",
];
