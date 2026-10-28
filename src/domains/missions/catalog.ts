export const SEASON = {
  name: "겨울방학 CAMPUS 미션",
  start: "2026-12-20T00:00:00+09:00",
  end: "2027-03-01T00:00:00+09:00",
  period: "2026.12.20 — 2027.02.28",
  demoNow: "2027-01-05T12:00:00+09:00",
};
export type MissionKind =
  | "bucket"
  | "friend"
  | "wishlist"
  | "taste"
  | "arrival"
  | "visit"
  | "eco"
  | "share";
export type AuthMethod = "app" | "qr" | "gps";
export interface Mission {
  id: string;
  title: string;
  short: string;
  description: string;
  points: number;
  xp: number;
  kind: MissionKind;
  stage: "before" | "onsite" | "after";
  seasonal: boolean;
  location: string;
  duration: string;
  stamp: string;
  methods: AuthMethod[];
  position?: [number, number];
  image?: string;
  prerequisite?: string;
}
export const missions: Mission[] = [
  {
    id: "bucket-list",
    title: "나의 겨울 제주 버킷리스트",
    short: "가고 싶은 곳을 고르면, 여행이 시작돼요",
    description:
      "이번 겨울, 제주에서 꼭 해보고 싶은 경험을 골라주세요. 하나만 골라도 나만의 여행 준비가 시작됩니다.",
    points: 100,
    xp: 50,
    kind: "bucket",
    stage: "before",
    seasonal: true,
    location: "어디서나 참여",
    duration: "1분",
    stamp: "여행의 시작",
    methods: ["app"],
  },
  {
    id: "friend-plan",
    title: "친구와 겨울 제주 미션 담기",
    short: "함께 떠날 친구와 여행 계획을 담아요",
    description:
      "함께 제주를 탐험할 친구의 별명과 가고 싶은 곳을 기록해 보세요. 실제 친구에게 메시지가 전송되지는 않는 체험용 여행 계획이에요.",
    points: 200,
    xp: 80,
    kind: "friend",
    stage: "before",
    seasonal: true,
    location: "어디서나 참여",
    duration: "1분",
    stamp: "함께하는 제주",
    methods: ["app"],
  },
  {
    id: "wishlist",
    title: "JDC 위시리스트 3개 담기",
    short: "여행에서 만나고 싶은 선물을 골라요",
    description:
      "제주 여행에서 만나고 싶은 상품을 3개 골라 나만의 위시리스트를 완성해 보세요. 상품은 발표용 예시이며 실제 주문으로 이어지지 않아요.",
    points: 100,
    xp: 50,
    kind: "wishlist",
    stage: "before",
    seasonal: true,
    location: "어디서나 참여",
    duration: "1분",
    stamp: "설렘 한 바구니",
    methods: ["app"],
  },
  {
    id: "winter-taste",
    title: "나의 겨울 제주 취향 찾기",
    short: "나에게 어울리는 겨울 여행은?",
    description:
      "겨울 제주의 세 가지 매력 중 마음이 가는 여행을 선택해 보세요. 취향에 맞는 현장 미션을 추천해 드려요.",
    points: 50,
    xp: 30,
    kind: "taste",
    stage: "before",
    seasonal: true,
    location: "어디서나 참여",
    duration: "30초",
    stamp: "취향 발견",
    methods: ["app"],
  },
  {
    id: "airport",
    title: "제주공항 도착 인증하기",
    short: "반가워요 제주! 현장 미션을 열어보세요",
    description:
      "제주공항 도착을 인증하면 겨울 제주 탐험이 시작됩니다. 공항 도착 미션 완료 후 관광지와 JDC 현장 미션이 열려요.",
    points: 500,
    xp: 100,
    kind: "arrival",
    stage: "onsite",
    seasonal: false,
    location: "제주국제공항",
    duration: "1분",
    stamp: "반가워 제주",
    methods: ["qr", "gps"],
    position: [43, 28],
    image: "map",
  },
  {
    id: "dongmun",
    title: "동문시장 방문하기",
    short: "제주의 맛과 활기를 만나는 시간",
    description:
      "따뜻한 먹거리와 제주 사람들의 이야기가 있는 동문시장을 둘러보세요. 현장에서 방문을 인증하면 해녀몽이의 발자국이 남아요.",
    points: 100,
    xp: 100,
    kind: "visit",
    stage: "onsite",
    seasonal: false,
    location: "제주 동문시장",
    duration: "10분",
    stamp: "제주의 맛",
    methods: ["qr", "gps"],
    position: [58, 25],
    prerequisite: "airport",
  },
  {
    id: "seongsan",
    title: "성산일출봉 방문하기",
    short: "푸른 겨울 바다와 새로운 시작",
    description:
      "제주의 대표 명소, 성산일출봉을 방문하고 아름다운 겨울 풍경을 인증해 보세요. 눈부신 바다와 함께한 순간을 지도에 남겨드려요.",
    points: 150,
    xp: 100,
    kind: "visit",
    stage: "onsite",
    seasonal: true,
    location: "성산일출봉",
    duration: "20분",
    stamp: "겨울의 첫 햇살",
    methods: ["qr", "gps"],
    position: [85, 42],
    image: "winter",
    prerequisite: "airport",
  },
  {
    id: "jdc-visit",
    title: "JDC 면세점 방문하기",
    short: "여행의 마지막 설렘까지 특별하게",
    description:
      "JDC 면세점에 들러 대학생만의 특별한 혜택을 만나보세요. 현장 QR 인증으로 포인트와 성장 경험치를 함께 받아요.",
    points: 200,
    xp: 100,
    kind: "visit",
    stage: "onsite",
    seasonal: false,
    location: "JDC 제주공항 지정면세점",
    duration: "1분",
    stamp: "특별한 선물",
    methods: ["qr"],
    position: [33, 40],
    prerequisite: "airport",
  },
  {
    id: "hyeopjae",
    title: "겨울 협재해변 산책하기",
    short: "투명한 겨울 바다를 눈에 담아요",
    description:
      "협재의 에메랄드빛 바다를 따라 천천히 걸어보세요. 바닷바람과 함께한 제주 여행의 한 장면을 기록해요.",
    points: 100,
    xp: 100,
    kind: "visit",
    stage: "onsite",
    seasonal: true,
    location: "협재해변",
    duration: "15분",
    stamp: "겨울 바다",
    methods: ["qr", "gps"],
    position: [17, 47],
    prerequisite: "airport",
  },
  {
    id: "hallim",
    title: "한림공원의 겨울 만나기",
    short: "고요한 겨울 정원을 탐험해요",
    description:
      "한림공원의 겨울 풍경 속에서 제주의 또 다른 모습을 발견해 보세요. 방문을 인증하고 탐험 지도를 채워요.",
    points: 100,
    xp: 100,
    kind: "visit",
    stage: "onsite",
    seasonal: false,
    location: "한림공원",
    duration: "20분",
    stamp: "겨울 정원",
    methods: ["qr", "gps"],
    position: [25, 64],
    prerequisite: "airport",
  },
  {
    id: "jungmun",
    title: "중문에서 초록 실천하기",
    short: "아름다운 제주를 오래도록",
    description:
      "중문 친환경 캠페인에 참여하고 운영 부스의 QR로 인증해 보세요. 제주의 자연을 위한 작은 실천이 기록돼요.",
    points: 150,
    xp: 100,
    kind: "eco",
    stage: "onsite",
    seasonal: true,
    location: "중문관광단지 캠페인 부스",
    duration: "20분",
    stamp: "초록 발자국",
    methods: ["qr"],
    position: [43, 77],
    prerequisite: "airport",
  },
  {
    id: "seogwipo",
    title: "서귀포 해변 돌아보기",
    short: "여유로운 겨울 해안을 만나요",
    description:
      "서귀포 해안에서 잠시 걸음을 늦추고 제주의 풍경을 담아보세요. 방문 완료 기록은 여행이 끝난 뒤에도 지도에 남아요.",
    points: 100,
    xp: 100,
    kind: "visit",
    stage: "onsite",
    seasonal: false,
    location: "서귀포 해안",
    duration: "15분",
    stamp: "느린 제주",
    methods: ["qr", "gps"],
    position: [65, 72],
    prerequisite: "airport",
  },
  {
    id: "travel-record",
    title: "나의 제주 활동 지도 공유하기",
    short: "함께한 순간을 여행 이야기로 남겨요",
    description:
      "한 곳 이상 다녀왔다면 나만의 제주 기록을 완성해 보세요. 여행 소감을 남기고 공유할 문구를 만들면 기록 미션이 완료돼요.",
    points: 50,
    xp: 50,
    kind: "share",
    stage: "after",
    seasonal: true,
    location: "어디서나 참여",
    duration: "1분",
    stamp: "제주를 기억해",
    methods: ["app"],
    prerequisite: "airport",
  },
];
export const placeMissions = missions.filter((m) => m.position);
export const bucketOptions = [
  "성산일출봉에서 겨울 바다 보기",
  "동문시장에서 맛있는 제주 만나기",
  "협재해변에서 천천히 걷기",
  "JDC에서 나를 위한 선물 고르기",
];
export const wishOptions = [
  "제주 감귤 초콜릿",
  "시트러스 향수",
  "보습 스킨케어",
  "겨울 여행 액세서리",
  "제주 로컬 티 세트",
];
export const tasteOptions = [
  "고요한 바다 산책",
  "제주 먹거리 탐방",
  "새로운 풍경 탐험",
];
export function validAnswer(mission: Mission, answer?: string): boolean {
  if (mission.kind === "bucket" || mission.kind === "wishlist") {
    try {
      const selected: unknown = JSON.parse(answer ?? "");
      const allowed = mission.kind === "bucket" ? bucketOptions : wishOptions;
      return (
        Array.isArray(selected) &&
        selected.length >= (mission.kind === "bucket" ? 1 : 3) &&
        new Set(selected).size === selected.length &&
        selected.every((v) => allowed.includes(v))
      );
    } catch {
      return false;
    }
  }
  if (mission.kind === "taste") return tasteOptions.includes(answer ?? "");
  if (mission.kind === "friend") {
    try {
      const a = JSON.parse(answer ?? "");
      return (
        typeof a.friend === "string" &&
        a.friend.trim().length >= 2 &&
        a.friend.length <= 30 &&
        bucketOptions.includes(a.place)
      );
    } catch {
      return false;
    }
  }
  if (mission.kind === "share")
    return (
      typeof answer === "string" &&
      answer.trim().length >= 5 &&
      answer.length <= 200
    );
  return answer === undefined;
}
