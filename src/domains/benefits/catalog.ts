export interface Reward {
  id: string;
  title: string;
  headline: string;
  detail: string;
  points: number;
  theme: "orange" | "blue" | "green";
}

export const rewards: Reward[] = [
  {
    id: "discount5",
    title: "5% 할인 쿠폰",
    headline: "5%",
    detail: "JDC 면세 쇼핑을 더 가볍게",
    points: 300,
    theme: "orange",
  },
  {
    id: "shipping",
    title: "무료배송 쿠폰",
    headline: "무료배송",
    detail: "제주에서 만난 마음을 집까지",
    points: 500,
    theme: "blue",
  },
  {
    id: "discount10",
    title: "10% 할인 쿠폰",
    headline: "10%",
    detail: "차곡차곡 모은 나를 위한 선물",
    points: 800,
    theme: "green",
  },
];
