export interface Reward {
  id: string;
  title: string;
  headline: string;
  detail: string;
  condition: string;
  points: number;
  theme: "orange" | "blue" | "green";
}
export const rewards: Reward[] = [
  {
    id: "discount10",
    title: "JDC 면세점 10% 할인쿠폰",
    headline: "10%",
    detail: "겨울 여행의 설렘에 더하는 혜택",
    condition: "50,000원 이상 구매 시 · 일부 상품 제외",
    points: 500,
    theme: "blue",
  },
  {
    id: "shipping",
    title: "무료배송 쿠폰",
    headline: "무료배송",
    detail: "제주에서 만난 선물을 집까지",
    condition: "배송 가능 상품 온라인 주문 시",
    points: 300,
    theme: "orange",
  },
  {
    id: "discount5",
    title: "JDC 면세점 5% 할인쿠폰",
    headline: "5%",
    detail: "대학생의 여행을 조금 더 가볍게",
    condition: "30,000원 이상 구매 시 · 일부 상품 제외",
    points: 300,
    theme: "green",
  },
];
