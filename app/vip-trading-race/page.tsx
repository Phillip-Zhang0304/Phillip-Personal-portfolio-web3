import type { Metadata } from "next";
import { VipTradingRacePage } from "@/components/sections/vip-trading-race-page";

export const metadata: Metadata = {
  title: "Gate VIP 合约争霸年终盛典 | Gate.com",
  description:
    "参与合约王者的年度加冕之战，冲刺 60,000 USDT 现金豪礼，解锁双榜单、九宫格抽奖与 VIP5+ 刮刮乐任务。"
};

export default function VipTradingRaceRoute() {
  return <VipTradingRacePage />;
}
