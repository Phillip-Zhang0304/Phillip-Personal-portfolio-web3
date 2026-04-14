"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type EventStatus = "upcoming" | "live" | "ended";

type Step = {
  label: string;
  volume: string;
  prize: string;
  active: boolean;
};

type LeaderboardEntry = {
  rank: number;
  name: string;
  metric: string;
  reward: string;
  trend: string;
};

type TaskItem = {
  title: string;
  description: string;
  reward: string;
  action: string;
};

type PrizeItem = {
  name: string;
  meta: string;
  quantity: string;
};

const registrationStart = new Date("2026-01-15T15:00:00+08:00");
const registrationEnd = new Date("2026-01-31T15:00:00+08:00");
const eventStart = new Date("2026-01-19T10:00:00+08:00");
const eventEnd = new Date("2026-02-02T23:59:00+08:00");

const totalPrizeSteps: Step[] = [
  { label: "Stage 01", volume: "500M", prize: "7,000 USDT", active: true },
  { label: "Stage 02", volume: "1B", prize: "10,000 USDT", active: true },
  { label: "Stage 03", volume: "2B", prize: "15,000 USDT", active: true },
  { label: "Stage 04", volume: "5B", prize: "22,000 USDT", active: true },
  { label: "Stage 05", volume: "10B", prize: "30,000 USDT", active: true },
  { label: "Final", volume: "20B", prize: "60,000 USDT", active: false }
];

const volumeLeaders: LeaderboardEntry[] = [
  { rank: 1, name: "WhaleAtlas", metric: "2.83B USDT", reward: "9,000", trend: "+12.4%" },
  { rank: 2, name: "NovaQuant", metric: "2.41B USDT", reward: "6,300", trend: "+10.1%" },
  { rank: 3, name: "GridRanger", metric: "2.17B USDT", reward: "4,500", trend: "+8.6%" },
  { rank: 4, name: "DeltaPilot", metric: "1.98B USDT", reward: "3,150", trend: "+7.2%" },
  { rank: 5, name: "MoonSigma", metric: "1.64B USDT", reward: "2,250", trend: "+6.8%" },
  { rank: 6, name: "HelixEdge", metric: "1.42B USDT", reward: "1,350", trend: "+5.1%" }
];

const pnlLeaders: LeaderboardEntry[] = [
  { rank: 1, name: "PineAlpha", metric: "+486,300 USDT", reward: "2,585", trend: "+18.2%" },
  { rank: 2, name: "OrbitZen", metric: "+402,110 USDT", reward: "1,650", trend: "+14.9%" },
  { rank: 3, name: "NightPulse", metric: "+336,080 USDT", reward: "1,050", trend: "+12.6%" },
  { rank: 4, name: "ApexRiver", metric: "+298,420 USDT", reward: "900", trend: "+11.4%" },
  { rank: 5, name: "PolarDrift", metric: "+253,900 USDT", reward: "750", trend: "+9.8%" },
  { rank: 6, name: "SignalCore", metric: "+221,500 USDT", reward: "600", trend: "+8.9%" }
];

const luckyTasks: TaskItem[] = [
  {
    title: "合约交易任务",
    description: "合约交易每达 1,000,000 USDT，可增加 1 次九宫格机会，单用户上限 20 次。",
    reward: "+1 抽奖机会 / 次",
    action: "去交易"
  },
  {
    title: "成为 VIP5",
    description:
      "首次成为 VIP5 及以上，或历史曾达到 VIP5 后降级、活动期间重新回到 VIP5 的用户可完成。",
    reward: "+2 抽奖机会",
    action: "去升级"
  }
];

const scratchTasks: TaskItem[] = [
  {
    title: "Level 1",
    description: "活动期间累计合约交易量达 2,500,000 USDT。",
    reward: "+1 刮奖机会",
    action: "去完成"
  },
  {
    title: "Level 2",
    description: "活动期间累计合约交易量达 5,000,000 USDT。",
    reward: "+2 刮奖机会",
    action: "继续冲刺"
  },
  {
    title: "Level 3",
    description: "活动期间累计合约交易量达 10,000,000 USDT。",
    reward: "+3 刮奖机会",
    action: "解锁关卡"
  },
  {
    title: "Level 4+",
    description: "完成 Level 3 后，每新增 10,000,000 USDT 合约交易量可重复获得奖励。",
    reward: "+3 刮奖机会 / 次",
    action: "循环挑战"
  }
];

const luckyPrizes: PrizeItem[] = [
  { name: "VIP 新年现金红包", meta: "0.68 / 0.88 / 1.88 / 8 / 88 USDT", quantity: "2,161 份" },
  { name: "Gate X RedBull 杯", meta: "联名实物奖品", quantity: "10 份" },
  { name: "Gate VIP 露营帐篷", meta: "高价值周边", quantity: "1 份" },
  { name: "Apple 全家桶", meta: "Mac + iPhone + iPad + Watch 组合", quantity: "0 份预留位" }
];

const scratchPrizes: PrizeItem[] = [
  { name: "0.08g 金条", meta: "折算价值 10.4 USDT", quantity: "250 份" },
  { name: "0.1g 金条", meta: "折算价值 13 USDT", quantity: "200 份" },
  { name: "0.5g 金条", meta: "折算价值 65 USDT", quantity: "44 份" },
  { name: "1g / 8g 金条", meta: "折算价值 130 / 1040 USDT", quantity: "12 份" }
];

const volumeRewards = [
  ["TOP 1", "9,000", "10,000,000"],
  ["TOP 2", "6,300", "10,000,000"],
  ["TOP 3", "4,500", "10,000,000"],
  ["TOP 4", "3,150", "10,000,000"],
  ["TOP 5", "2,250", "10,000,000"],
  ["TOP 6-10", "1,350 / 1,125 / 900 / 810 / 540", "10,000,000"],
  ["TOP 11-20", "450", "5,000,000"],
  ["TOP 21-30", "360", "5,000,000"]
];

const pnlRewards = [
  ["TOP 1", "2,585", "1,000,000"],
  ["TOP 2", "1,650", "1,000,000"],
  ["TOP 3", "1,050", "1,000,000"],
  ["TOP 4", "900", "1,000,000"],
  ["TOP 5", "750", "1,000,000"],
  ["TOP 6-10", "600 / 525 / 450 / 375 / 300", "1,000,000"],
  ["TOP 11-20", "135", "1,000,000"],
  ["TOP 21-30", "113", "1,000,000"]
];

const participationRules = [
  "所有 VIP1-VIP12 用户均可报名；VIP5-VIP12 额外参与刮刮乐差异化奖励。",
  "交易量榜最低门槛：TOP 10 需至少 10,000,000 USD；TOP 11-50 需至少 5,000,000 USD；其余上榜者至少 2,500,000 USD。",
  "收益额榜需满足最低 1,000,000 USD 合约交易量门槛，仅统计永续合约 USDT 本位交易。",
  "排行榜与奖励数据每 10 分钟刷新一次，页面展示为参考数据，最终以风控和数据团队核算结果为准。",
  "API 用户、专业等级用户、做市商、企业、机构、代理商及子账户不可参与本次活动。"
];

const winningRules = [
  "用户须完成 KYC Level 2 且在报名期内报名，方有资格领取活动奖励。",
  "仅统计报名后的累计交易量；若交易量相同，则按达成该交易量的时间先后决定排名。",
  "交易赛奖励、荣耀回归奖励、体验券将在活动结束后十个工作日内发放，抽奖中的实物奖励也将在十个工作日内发放。",
  "金条刮刮乐奖励将于活动结束后折算为 USDT 发放，按 1g 黄金 = 130 USDT 计算。",
  "综合总冠军根据用户在交易量榜和收益额榜获得的现金奖励总和进行排名。"
];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getEventStatus(now: number): EventStatus {
  if (now < eventStart.getTime()) {
    return "upcoming";
  }

  if (now <= eventEnd.getTime()) {
    return "live";
  }

  return "ended";
}

function getTargetTime(status: EventStatus) {
  if (status === "upcoming") {
    return eventStart.getTime();
  }

  if (status === "live") {
    return eventEnd.getTime();
  }

  return eventEnd.getTime();
}

function getCountdown(now: number, target: number): CountdownParts {
  const distance = Math.max(0, target - now);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function formatStatus(status: EventStatus) {
  if (status === "upcoming") {
    return "距离开赛";
  }

  if (status === "live") {
    return "距离结束";
  }

  return "活动已结束";
}

function CountdownClock() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const status = useMemo(() => getEventStatus(now), [now]);
  const countdown = useMemo(() => getCountdown(now, getTargetTime(status)), [now, status]);

  const blocks = [
    { label: "DAYS", value: pad(countdown.days) },
    { label: "HRS", value: pad(countdown.hours) },
    { label: "MIN", value: pad(countdown.minutes) },
    { label: "SEC", value: pad(countdown.seconds) }
  ];

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/6 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#f3c76a]">Event Status</p>
          <p className="mt-2 text-xl font-semibold text-white">{formatStatus(status)}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
            status === "live"
              ? "bg-emerald-400/15 text-emerald-300"
              : status === "upcoming"
                ? "bg-sky-400/15 text-sky-200"
                : "bg-white/10 text-white/65"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="rounded-[24px] border border-white/8 bg-[#0d1634]/90 px-3 py-4 text-center"
          >
            <div className="font-[var(--font-anton)] text-3xl tracking-[0.06em] text-white">
              {block.value}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/45">
              {block.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.32em] text-[#f3c76a]">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-white/68 md:text-base">{description}</p>
    </div>
  );
}

function ActionButton({
  children,
  secondary = false
}: {
  children: string;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
        secondary
          ? "border border-white/12 bg-white/5 text-white hover:bg-white/10"
          : "bg-[linear-gradient(135deg,#f0cf84_0%,#bf7f2c_100%)] text-[#160f06] shadow-[0_18px_40px_rgba(223,166,81,0.3)] hover:translate-y-[-1px]"
      }`}
    >
      {children}
    </button>
  );
}

function MetricCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className="mt-4 font-[var(--font-anton)] text-4xl tracking-[0.05em] text-white md:text-5xl">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-white/65">{detail}</p>
    </div>
  );
}

function LeaderboardCard({
  title,
  subtitle,
  entries,
  rewardRows
}: {
  title: string;
  subtitle: string;
  entries: LeaderboardEntry[];
  rewardRows: string[][];
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,44,0.96)_0%,rgba(6,9,20,0.96)_100%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">{title}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{subtitle}</h3>
        </div>
        <div className="rounded-full border border-emerald-300/12 bg-emerald-300/8 px-4 py-2 text-xs tracking-[0.22em] text-emerald-200">
          数据每 10 分钟更新
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-white/8">
        <div className="grid grid-cols-[76px_1.3fr_1fr_110px] bg-white/6 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/45">
          <span>Rank</span>
          <span>Nickname</span>
          <span>Score</span>
          <span>Reward</span>
        </div>
        {entries.map((entry) => (
          <div
            key={`${title}-${entry.rank}`}
            className="grid grid-cols-[76px_1.3fr_1fr_110px] items-center border-t border-white/8 px-4 py-4 text-sm text-white/82"
          >
            <div className="flex items-center gap-3">
              <span className="font-[var(--font-anton)] text-2xl text-white">
                {pad(entry.rank)}
              </span>
            </div>
            <div>
              <div className="font-medium text-white">{entry.name}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
                {entry.trend}
              </div>
            </div>
            <div className="font-medium text-white">{entry.metric}</div>
            <div className="text-right font-[var(--font-anton)] text-xl text-[#f3c76a]">
              {entry.reward}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] border border-white/8 bg-black/20 p-4">
        <div className="grid grid-cols-3 gap-3 border-b border-white/8 px-2 pb-3 text-xs uppercase tracking-[0.18em] text-white/45">
          <span>Rank Band</span>
          <span>Reward (USDT)</span>
          <span>Minimum Volume</span>
        </div>
        {rewardRows.map((row) => (
          <div
            key={`${title}-${row[0]}`}
            className="grid grid-cols-3 gap-3 px-2 py-3 text-sm text-white/78"
          >
            <span>{row[0]}</span>
            <span>{row[1]}</span>
            <span>{row[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ title, description, reward, action }: TaskItem) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <p className="mt-3 text-sm leading-6 text-white/68">{description}</p>
        </div>
        <div className="rounded-full border border-[#f3c76a]/25 bg-[#f3c76a]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#f3c76a]">
          {reward}
        </div>
      </div>
      <div className="mt-5">
        <ActionButton secondary>{action}</ActionButton>
      </div>
    </div>
  );
}

function PrizeCard({ title, kicker, prizes }: { title: string; kicker: string; prizes: PrizeItem[] }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(19,15,30,0.9)_0%,rgba(8,10,18,0.9)_100%)] p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">{kicker}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
      <div className="mt-6 space-y-3">
        {prizes.map((prize) => (
          <div
            key={prize.name}
            className="flex items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-white/5 px-4 py-4"
          >
            <div>
              <div className="text-base font-medium text-white">{prize.name}</div>
              <div className="mt-1 text-sm text-white/56">{prize.meta}</div>
            </div>
            <div className="font-[var(--font-anton)] text-2xl tracking-[0.05em] text-[#f3c76a]">
              {prize.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div
          key={item}
          className="flex gap-4 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3c76a] text-sm font-semibold text-[#120d05]">
            {index + 1}
          </div>
          <p className="text-sm leading-7 text-white/72">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function VipTradingRacePage() {
  const currentTotalVolume = 12.86;
  const progressPercent = Math.min((currentTotalVolume / 20) * 100, 100);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#04050b] text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,97,234,0.35),transparent_32%),radial-gradient(circle_at_75%_18%,rgba(249,194,87,0.18),transparent_22%),linear-gradient(180deg,#071227_0%,#05070f_100%)]" />
        <div className="absolute left-1/2 top-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[#123ea7]/30 blur-3xl" />
        <div className="absolute bottom-[-240px] right-[-80px] h-[420px] w-[420px] rounded-full bg-[#f3c76a]/14 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 pb-20 pt-8 md:px-8 md:pb-24 md:pt-10 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/74 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#f3c76a]" />
              Gate VIP Annual Finals
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/65 backdrop-blur-md">
              报名时间 {registrationStart.toLocaleString("zh-CN", { hour12: false })} -{" "}
              {registrationEnd.toLocaleString("zh-CN", { hour12: false })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_420px] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#f3c76a]/18 bg-[#f3c76a]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#f3c76a]">
                VIP Futures Championship
              </div>
              <h1 className="mt-6 max-w-4xl font-[var(--font-anton)] text-[56px] uppercase leading-[0.92] tracking-[0.02em] text-white md:text-[92px]">
                Trade For Glory
              </h1>
              <h2 className="mt-3 max-w-4xl text-2xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Gate VIP 合约争霸年终盛典
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                面向 VIP1-VIP12 的年度交易赛事，双榜单共享总奖池，叠加九宫格抽奖与 VIP5+
                刮刮乐奖励机制，冲刺最高 60,000 USDT 现金大奖与品牌荣誉。
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <ActionButton>立即报名</ActionButton>
                <ActionButton secondary>查看规则</ActionButton>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <MetricCard
                  label="Unlock Prize Pool"
                  value="60,000"
                  detail="按全体报名用户总合约交易量逐级解锁，交易量榜与收益额榜共享总奖池。"
                />
                <MetricCard
                  label="Two Core Arenas"
                  value="2"
                  detail="钻石赛区按合约交易量排名，白金赛区按合约收益额排名。"
                />
                <MetricCard
                  label="Lucky Mechanics"
                  value="2"
                  detail="九宫格幸运抽奖池覆盖 VIP1-12，刮刮乐奖池覆盖 VIP5-12。"
                />
              </div>
            </div>

            <div className="space-y-5">
              <CountdownClock />
              <div className="rounded-[32px] border border-white/10 bg-[#091120]/88 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.3em] text-[#f3c76a]">Arena Snapshot</p>
                <div className="mt-5 grid gap-4">
                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-white/52">活动玩法</p>
                    <p className="mt-2 text-lg font-medium text-white">交易赛 + 幸运抽奖 + 刮刮乐挑战</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-white/52">参与用户</p>
                    <p className="mt-2 text-lg font-medium text-white">VIP1-VIP12 全部开放，VIP5+ 解锁高阶任务</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-white/52">品牌荣誉</p>
                    <p className="mt-2 text-lg font-medium text-white">总冠军由交易量奖池 + 收益额奖池综合成绩决出</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-6 py-20 md:px-8 xl:px-0">
        <SectionTitle
          eyebrow="Total Prize Pool"
          title="共享总奖池进度"
          description="活动期间所有报名用户的总合约交易量决定总奖池解锁进度。页面重点展示当前总交易量与已解锁奖池金额，让用户明确知道赛事热度正在把奖金推到哪个阶段。"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,22,52,0.92)_0%,rgba(6,8,18,0.92)_100%)] p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Current Volume</p>
                <p className="mt-4 font-[var(--font-anton)] text-6xl tracking-[0.04em] text-white">
                  {currentTotalVolume.toFixed(2)}B
                </p>
              </div>
              <div className="rounded-[24px] border border-[#f3c76a]/18 bg-[#f3c76a]/8 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">Unlocked Pool</p>
                <p className="mt-2 font-[var(--font-anton)] text-4xl tracking-[0.05em] text-white">
                  30,000
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-4 rounded-full bg-white/8 p-[3px]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#f3c76a_0%,#d88c2b_42%,#567bff_100%)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/38">
                <span>0</span>
                <span>20B</span>
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {totalPrizeSteps.map((step) => (
                <div
                  key={step.label}
                  className={`rounded-[24px] border px-4 py-4 ${
                    step.active
                      ? "border-[#f3c76a]/20 bg-[#f3c76a]/10"
                      : "border-white/8 bg-white/5"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">{step.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {step.volume}
                  </p>
                  <p className="mt-2 text-sm text-white/65">{step.prize}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">Shared Rule</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
              奖池共享方式
            </h3>
            <div className="mt-6 space-y-4 text-sm leading-7 text-white/68">
              <p>
                报名后即可参与交易赛，钻石赛区与白金赛区根据当前已解锁的总奖池阶梯分配奖励。
              </p>
              <p>
                随着全体报名用户总合约交易量增长，交易量榜最高可提升至 45,000 USDT，收益额榜最高可提升至 15,000 USDT。
              </p>
              <p>
                总奖池阶梯与单榜奖励同步变化，页面中既要体现赛事氛围，也要清晰表达用户还能冲刺到哪一档奖金。
              </p>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/8 bg-black/20 p-5">
              <p className="text-sm text-white/52">页面展示提示</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                <li>显示当前合约交易量与已解锁总奖池。</li>
                <li>榜单奖励与奖池阶梯要联动展示。</li>
                <li>比赛时间只在规则区说明，头部保留倒计时即可。</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-6 py-20 md:px-8 xl:px-0">
        <SectionTitle
          eyebrow="Leaderboard Arena"
          title="钻石赛区 + 白金赛区"
          description="双榜单都需要给出强烈的竞技感与高价值感。上层展示实时排名和预估奖励，下层给出当前阶段的奖励分配摘要，帮助用户理解门槛和收益。"
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <LeaderboardCard
            title="Diamond Arena"
            subtitle="合约交易量排名"
            entries={volumeLeaders}
            rewardRows={volumeRewards}
          />
          <LeaderboardCard
            title="Platinum Arena"
            subtitle="合约收益额排名"
            entries={pnlLeaders}
            rewardRows={pnlRewards}
          />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 py-20 md:px-8 xl:grid-cols-[1.08fr_0.92fr] xl:px-0">
        <div>
          <SectionTitle
            eyebrow="Lucky Grid"
            title="幸运抽奖池"
            description="VIP1-VIP12 用户均可参与九宫格抽奖。任务信息一行一个，强调完成门槛、可获得的次数和清晰的行动按钮，同时搭配奖池亮点展示。"
          />
          <div className="mt-8 grid gap-4">
            {luckyTasks.map((task) => (
              <TaskCard key={task.title} {...task} />
            ))}
          </div>

          <div className="mt-8 rounded-[32px] border border-white/10 bg-white/6 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">Nine-grid Draw</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }, (_, index) => (
                <div
                  key={`grid-${index + 1}`}
                  className={`aspect-square rounded-[24px] border ${
                    index === 4
                      ? "border-[#f3c76a]/35 bg-[linear-gradient(180deg,rgba(243,199,106,0.18)_0%,rgba(191,127,44,0.18)_100%)]"
                      : "border-white/8 bg-white/5"
                  } p-3`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Prize {index + 1}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {index === 4 ? "88 USDT 红包" : index === 0 ? "RedBull 杯" : "现金红包"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PrizeCard title="幸运抽奖奖品池" kicker="Prize Matrix" prizes={luckyPrizes} />
      </section>

      <section className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 py-20 md:px-8 xl:grid-cols-[1.08fr_0.92fr] xl:px-0">
        <div>
          <SectionTitle
            eyebrow="Scratch Challenge"
            title="刮刮乐奖池"
            description="面向 VIP5-VIP12 的进阶挑战区。Level 1-3 按节点冲刺，Level 4+ 进入循环奖励阶段。这里重点表现等级进度、剩余刮奖次数与黄金奖励价值。"
          />

          <div className="mt-8 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,15,6,0.92)_0%,rgba(10,10,13,0.96)_100%)] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">Scratch Progress</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                  当前累计进度 6.8M / 10M
                </h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/72">
                剩余刮奖次数 03
              </div>
            </div>

            <div className="mt-8">
              <div className="relative h-3 rounded-full bg-white/8">
                <div className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#f4d58b_0%,#d98c2b_100%)]" style={{ width: "68%" }} />
                <div className="absolute left-[25%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#090a0e] bg-[#f3c76a]" />
                <div className="absolute left-[50%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#090a0e] bg-[#f3c76a]" />
                <div className="absolute left-full top-1/2 h-5 w-5 -translate-x-full -translate-y-1/2 rounded-full border-4 border-[#090a0e] bg-white/20" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-white/68">
                <div>Level 1: 2.5M</div>
                <div>Level 2: 5M</div>
                <div>Level 3: 10M</div>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {scratchTasks.map((task) => (
                <TaskCard key={task.title} {...task} />
              ))}
            </div>
          </div>
        </div>

        <PrizeCard title="刮刮乐黄金奖池" kicker="Gold Reward" prizes={scratchPrizes} />
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-6 py-20 md:px-8 xl:px-0">
        <SectionTitle
          eyebrow="Rules & Conditions"
          title="参与规则与获奖条件"
          description="PRD 中的静态规则信息需要收纳得足够清晰，既方便用户快速扫读，也保留风控与奖励逻辑的严谨感。这里先按参与规则和获奖条件分为两列展示。"
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">Participation</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
              如何参与与注意事项
            </h3>
            <div className="mt-6">
              <RuleList items={participationRules} />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#f3c76a]">Winning Logic</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
              获奖条件与发放说明
            </h3>
            <div className="mt-6">
              <RuleList items={winningRules} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
