import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Lock,
  Orbit,
  Search,
  Shield,
  Sparkles,
  Terminal,
  Wallet,
  Waves,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicOpsBoard } from "../components/PublicOpsBoard";
import { NetworkStatusGrid } from "../components/NetworkStatusGrid";
import { Roadmap } from "../components/Roadmap";
import { ExecutionFlow } from "../components/motion/ExecutionFlow";
import { KineticGrid } from "../components/motion/KineticGrid";
import { SettlementFlow } from "../components/motion/SettlementFlow";
import { Stagger } from "../components/motion/Reveal";
import { Button } from "../components/ui/button";
import { TiltCard } from "../components/ui/TiltCard";
import { useTranslation } from "../contexts/LanguageContext";
import { motionEase, revealSoft, staggerSlow } from "../lib/motion";
import { MAINNET_STATUS, NETWORK } from "../constants/network";

export function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Hero />
      <ChoosePathSection />
      <LiveProofSection />
      <AISettlementDemo />
      <DeveloperSection />
      <FinalCTA />
      <RiskNotice />
    </div>
  );
}

function Hero() {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  const guidePoints = isEn
    ? [
        "Define machine boundaries before execution starts",
        "Issue revocable sessions instead of permanent trust",
        "Settle AI and machine actions with verifiable proof",
      ]
    : [
        "在执行前先定义机器可行动的边界",
        "发放可撤销的会话权限，而不是永久信任",
        "用可验证证明完成 AI 与机器动作结算",
      ];

  const summaryCards = isEn
    ? [
        { label: "Core framing", value: "Web4 execution layer" },
        { label: "Primary audience", value: "Builders, operators, AI apps" },
        { label: "Current state", value: "Public testnet on live endpoints" },
        { label: "Operating form", value: "Project, not legal entity yet" },
      ]
    : [
        { label: "核心定位", value: "Web4 执行层" },
        { label: "主要用户", value: "开发者、运营者、AI 应用" },
        { label: "当前状态", value: "公开测试网与线上端点运行中" },
        { label: "当前形态", value: "项目阶段，尚未公开设立实体" },
      ];

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#ffffff_100%)] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
      <KineticGrid />
      <ExecutionFlow />
      <motion.div
        className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-klein/25 to-transparent"
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, ease: motionEase.emphasized }}
      />
      <div className="mx-auto grid max-w-7xl items-start gap-18 xl:gap-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.82fr)]">
        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: motionEase.emphasized }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-klein/10 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-klein shadow-[0_14px_50px_rgba(0,47,167,0.08)] backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-klein animate-pulse" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: motionEase.emphasized }}
            className="max-w-5xl text-5xl font-display font-bold tracking-[-0.06em] text-ink md:text-7xl xl:text-[5.6rem] xl:leading-[0.92]"
          >
            {isEn
              ? "A cleaner execution layer for AI, apps, and machine payments."
              : "为 AI、应用与机器支付打造更清晰的执行层。"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.56, ease: motionEase.standard }}
            className="mt-8 max-w-3xl text-lg leading-8 text-ink/70 md:text-2xl md:leading-10"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.5, ease: motionEase.standard }}
            className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {guidePoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-klein/10 bg-white/75 px-4 py-4 text-sm font-medium text-ink/75 shadow-[0_18px_60px_rgba(0,47,167,0.06)] backdrop-blur-xl"
              >
                <div className="mb-2 flex items-center gap-2 text-klein">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.22em]">
                    {isEn ? "Protocol rule" : "协议原则"}
                  </span>
                </div>
                {point}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.46, ease: motionEase.standard }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button
              size="xl"
              variant="klein"
              className="group rounded-2xl shadow-[0_18px_60px_rgba(0,47,167,0.25)]"
              asChild
            >
              <a href={NETWORK.endpoints.explorer} target="_blank" rel="noreferrer">
                {t("hero.cta.explorer")}
                <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="group rounded-2xl border-klein/15 bg-white/80 shadow-[0_12px_40px_rgba(10,15,28,0.06)]"
              asChild
            >
              <Link to="/docs/en/ai-web4-official-demo">
                {t("hero.cta.build")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="xl" variant="ghost" className="rounded-2xl" asChild>
              <Link to="/testnet">
                {t("hero.cta.join")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-14 grid gap-5 border-t border-border/70 pt-10 md:grid-cols-2 2xl:grid-cols-4"
          >
            {summaryCards.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.06, duration: 0.38 }}
                className="rounded-2xl border border-border/70 bg-white/70 px-4 py-4 backdrop-blur-xl"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink/35">
                  {item.label}
                </div>
                <div className="mt-2 text-sm font-semibold text-ink/85">{item.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 28, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.1, duration: 0.72, ease: motionEase.emphasized }}
            className="relative z-10 lg:pt-10"
        >
          <TiltCard className="h-full">
            <div className="ynx-glass relative overflow-hidden rounded-[36px] border border-klein/12 p-7 md:p-8 shadow-[0_36px_120px_rgba(0,47,167,0.16)]">
              <motion.div
                className="absolute -right-10 top-10 h-36 w-36 rounded-full bg-klein/15 blur-[70px]"
                animate={{ opacity: [0.4, 0.8, 0.45], scale: [1, 1.08, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-[54px]"
                animate={{ opacity: [0.3, 0.6, 0.3], y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-klein/70">
                    {isEn ? "Protocol canvas" : "协议画布"}
                  </div>
                  <h2 className="mt-2 text-2xl font-display font-bold tracking-tight text-ink">
                    {isEn ? "YNX at a glance" : "一眼看懂 YNX"}
                  </h2>
                </div>
                <div className="rounded-full border border-klein/10 bg-white/80 p-2 text-klein shadow-sm">
                  <Orbit className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {[
                  {
                    label: isEn ? "Policy layer" : "策略层",
                    title: isEn ? "Humans define boundaries first." : "先由人类定义边界。",
                    text: isEn
                      ? "Spend limits, action scopes, and session windows are explicit protocol objects."
                      : "额度、动作范围、会话时限都被定义为明确的协议对象。",
                  },
                  {
                    label: isEn ? "Execution layer" : "执行层",
                    title: isEn ? "Agents and apps execute inside those rules." : "智能体与应用在规则内执行。",
                    text: isEn
                      ? "No hand-wavy trust model. Sessions are bounded, revocable, and traceable."
                      : "不是模糊信任模型，而是受限、可撤销、可追踪的会话执行。",
                  },
                  {
                    label: isEn ? "Settlement layer" : "结算层",
                    title: isEn ? "Outcome and reward settle with proof." : "结果与奖励通过证明完成结算。",
                    text: isEn
                      ? "AI jobs, machine payments, and service access can all resolve on live endpoints."
                      : "AI 任务、机器支付与服务访问都可以在真实端点上完成结算。",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 0.42 }}
                    className="rounded-[24px] border border-white/70 bg-white/80 p-5 backdrop-blur-xl"
                  >
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-klein/60">
                      {item.label}
                    </div>
                    <div className="text-base font-semibold text-ink">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-ink/62">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: isEn ? "Chain ID" : "链 ID",
                    value: NETWORK.evmChainId,
                  },
                  {
                    label: isEn ? "Mainnet gate" : "主网门禁",
                    value: MAINNET_STATUS.gate,
                  },
                  {
                    label: isEn ? "Public explorer" : "公开浏览器",
                    value: "explorer.ynxweb4.com",
                  },
                  {
                    label: isEn ? "Current phase" : "当前阶段",
                    value: MAINNET_STATUS.stage,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/80 bg-surface/60 px-4 py-4"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/35">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-ink/82">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

function ChoosePathSection() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const paths = isEn
    ? [
        {
          icon: <Search className="h-5 w-5" />,
          title: "I want to understand YNX quickly",
          desc: "Start with the product framing, current boundaries, and the cleanest docs path.",
          href: "/about",
          cta: "Open About",
        },
        {
          icon: <Globe className="h-5 w-5" />,
          title: "I want to check the live network",
          desc: "See public endpoints, validator signals, and the current public operating surface.",
          href: "/testnet",
          cta: "View Testnet",
        },
        {
          icon: <Terminal className="h-5 w-5" />,
          title: "I want to build on it",
          desc: "Go straight to RPC, EVM access, join guides, and integration docs.",
          href: "/builders",
          cta: "Builder Path",
        },
        {
          icon: <Wallet className="h-5 w-5" />,
          title: "I want to try bridge, assets, or swap",
          desc: "Get test assets first, then bridge in, trade, or withdraw through public flows.",
          href: "/test-assets",
          cta: "Start With Assets",
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: "I want to review operational readiness",
          desc: "Inspect route evidence, blockers, and why testnet progress is not the same as production.",
          href: "/readiness",
          cta: "Review Gates",
        },
        {
          icon: <FileText className="h-5 w-5" />,
          title: "I want readable docs, not just pages",
          desc: "Use the docs hub to browse by task instead of guessing which document title matters.",
          href: "/docs",
          cta: "Open Docs Hub",
        },
      ]
    : [
        {
          icon: <Search className="h-5 w-5" />,
          title: "我想先快速理解 YNX",
          desc: "先看产品定位、当前边界，以及最清晰的阅读路径。",
          href: "/about",
          cta: "查看关于",
        },
        {
          icon: <Globe className="h-5 w-5" />,
          title: "我想先看网络是否真的在运行",
          desc: "直接看公开端点、验证者信号和当前运行表面。",
          href: "/testnet",
          cta: "查看测试网",
        },
        {
          icon: <Terminal className="h-5 w-5" />,
          title: "我想接入和开发",
          desc: "直接进入 RPC、EVM 接入、加入手册和集成文档。",
          href: "/builders",
          cta: "开发者路径",
        },
        {
          icon: <Wallet className="h-5 w-5" />,
          title: "我想试跨链、资产和交易",
          desc: "先领测试资产，再体验跨链、交易和提现路径。",
          href: "/test-assets",
          cta: "先拿资产",
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: "我想看就绪度和风险",
          desc: "检查路由证据、剩余阻塞项，以及为何测试网不等于生产。",
          href: "/readiness",
          cta: "查看门禁",
        },
        {
          icon: <FileText className="h-5 w-5" />,
          title: "我想按任务找文档",
          desc: "通过文档中心按任务浏览，而不是猜文件名。",
          href: "/docs",
          cta: "打开文档中心",
        },
      ];

  return (
    <section className="border-y border-border/60 bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/70">
              {isEn ? "Start by task" : "按任务开始"}
            </div>
            <h2 className="mt-4 text-4xl font-display font-bold tracking-[-0.05em] text-ink md:text-5xl">
              {isEn ? "Most people do not want every page. They want the right next step." : "大多数人不是想看所有页面，而是想找到下一步。"}
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink/64">
              {isEn
                ? "Pick the closest intention below and the site will route you into the right operating path, rather than making you decode internal product labels."
                : "从下面选最接近你当前目的的一条路径，网站会把你带到更合适的入口，而不是让你先理解内部命名。"}
            </p>
          </div>
          <Link to="/docs" className="inline-flex items-center gap-2 text-sm font-semibold text-klein transition-colors hover:text-klein-dark">
            {isEn ? "Open the full docs hub" : "打开完整文档中心"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {paths.map((path) => (
            <Link
              key={path.title}
              to={path.href}
              className="group ynx-panel rounded-[32px] border border-klein/10 p-7 transition-all hover:-translate-y-1 hover:border-klein/22 hover:shadow-[0_20px_80px_rgba(0,47,167,0.08)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-2xl border border-klein/10 bg-klein/6 p-3 text-klein">{path.icon}</div>
                <ArrowRight className="h-4 w-4 text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-klein" />
              </div>
              <h3 className="mt-6 text-2xl font-display font-bold tracking-tight text-ink">{path.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink/62">{path.desc}</p>
              <div className="mt-6 inline-flex rounded-full border border-klein/12 bg-white/85 px-3 py-2 text-xs font-semibold text-klein">
                {path.cta}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const items = isEn
    ? [
        "Public testnet project",
        "No public legal entity announced yet",
        "No custody claim",
        "Real-asset trading not live",
      ]
    : ["公开测试网项目", "尚未公开设立法律实体", "不做托管承诺", "真实资产交易尚未上线"];

  return (
    <section className="border-b border-border/60 bg-white px-6 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-ink/35">
          {isEn ? "Boundary before hype" : "先讲边界，再讲想象空间"}
        </div>
        {items.map((item) => (
          <div key={item} className="inline-flex items-center gap-3 text-sm font-medium text-ink/72">
            <span className="h-1.5 w-1.5 rounded-full bg-klein" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const steps = isEn
    ? [
        {
          id: "01",
          title: "Set policy first",
          desc: "Owners define limits, approved actions, and session duration before any agent gets authority.",
          icon: <Lock className="h-5 w-5" />,
        },
        {
          id: "02",
          title: "Execute with bounded sessions",
          desc: "Apps and AI workers operate through capability windows instead of permanent control.",
          icon: <Waves className="h-5 w-5" />,
        },
        {
          id: "03",
          title: "Settle and verify",
          desc: "Payments, completion, and service access resolve with proofs on live public endpoints.",
          icon: <Shield className="h-5 w-5" />,
        },
      ]
    : [
        {
          id: "01",
          title: "先定义策略",
          desc: "在任何智能体获得权限前，由所有者先定义额度、动作与时限。",
          icon: <Lock className="h-5 w-5" />,
        },
        {
          id: "02",
          title: "通过受限会话执行",
          desc: "应用和 AI 工作者通过能力窗口运行，而不是拿到永久控制权。",
          icon: <Waves className="h-5 w-5" />,
        },
        {
          id: "03",
          title: "完成结算与验证",
          desc: "支付、完成状态和服务访问通过真实公开端点与证明来收敛。",
          icon: <Shield className="h-5 w-5" />,
        },
      ];

  return (
    <section className="bg-white px-6 py-28 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/70">
            {isEn ? "A simpler story" : "更简单的叙事"}
          </div>
          <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.05em] text-ink md:text-6xl">
            {isEn ? "What YNX actually does." : "YNX 到底在做什么。"}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/65">
            {isEn
              ? "YNX is not another vague chain homepage. It is an execution environment where policy, session authority, and settlement are explicit infrastructure for AI-native products."
              : "YNX 不是一个只讲概念的链主页，而是把策略、会话权限和结算明确做成基础设施，服务 AI 原生产品的执行环境。"}
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerSlow}
          className="mt-16 grid gap-8 lg:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div key={step.id} variants={revealSoft}>
              <TiltCard className="h-full">
                <div className="ynx-panel h-full rounded-[28px] border border-klein/10 p-7">
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl border border-klein/10 bg-klein/6 p-3 text-klein">
                      {step.icon}
                    </div>
                    <div className="text-sm font-display font-bold tracking-[0.18em] text-klein/35">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="mt-10 text-2xl font-display font-bold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-ink/65">{step.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LiveProofSection() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="border-b border-border/60 bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="ynx-panel rounded-[32px] border border-klein/10 p-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/70">
              {isEn ? "Live proof, not slides" : "不是幻灯片，而是线上证据"}
            </div>
            <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.05em] text-ink">
              {isEn ? "Show the operating surface." : "把运行中的表面直接展示出来。"}
            </h2>
            <p className="mt-6 text-base leading-8 text-ink/65">
              {isEn
                ? "For first-time visitors, the quickest trust signal is simple: are the endpoints alive, is the operator surface visible, and can someone understand the current state without decoding internal jargon?"
                : "对于第一次访问的人来说，最快的信任信号很简单: 端点是否在线、运营表面是否可见、当前状态是否能在不读内部黑话的情况下被理解。"}
            </p>

            <div className="mt-8 space-y-3">
              {[
                isEn ? "Live health across public services" : "公开服务的实时健康状态",
                isEn ? "Validator and route automation visibility" : "验证者与路由自动化可视性",
                isEn ? "A cleaner path from product story to current operations" : "从产品叙事到当前运营状态的清晰路径",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-white/80 px-4 py-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-klein" />
                  <span className="text-sm leading-7 text-ink/75">{item}</span>
                </div>
              ))}
            </div>
          </div>

            <div className="space-y-6">
              <div className="ynx-glass rounded-[32px] border border-klein/10 p-6">
                <NetworkStatusGrid />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="ynx-glass rounded-[32px] border border-klein/10 p-6">
              <PublicOpsBoard />
            </div>
          </div>
      </div>
    </section>
  );
}

function DeveloperSection() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const endpoints = [
    { label: isEn ? "Cosmos RPC" : "Cosmos RPC", value: NETWORK.endpoints.rpc, badge: "Cosmos" },
    { label: "gRPC", value: NETWORK.endpoints.grpc, badge: "Remote" },
    { label: isEn ? "EVM RPC" : "EVM RPC", value: NETWORK.endpoints.evm, badge: "Ethereum" },
    { label: isEn ? "Chain ID" : "链 ID", value: NETWORK.evmChainId, badge: "9102" },
    { label: isEn ? "Faucet" : "测试水龙头", value: NETWORK.endpoints.faucet, badge: "Free Token" },
  ];

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,98,255,0.22),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(0,47,167,0.26),transparent_40%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerSlow}
          className="relative z-10"
        >
          <motion.div variants={revealSoft} className="max-w-xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/80">
              {isEn ? "Developer access" : "开发者接入"}
            </div>
            <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.05em] text-white md:text-6xl">
              {isEn ? "Connect in minutes, not weeks." : "几分钟接入，而不是几周。"}
            </h2>
            <p className="mt-6 text-lg leading-9 text-white/65">
              {isEn
                ? "YNX exposes the execution surface in a way operators and builders can actually use: public RPC, EVM access, faucet, and a direct CLI path into the live network."
                : "YNX 把执行表面做成开发者和运营者真正能用的样子: 公开 RPC、EVM 接入、水龙头以及直接进入线上网络的 CLI 路径。"}
            </p>
          </motion.div>
          <Stagger className="mt-10 space-y-4">
            {endpoints.map((ep) => (
              <EndpointRow key={ep.value} {...ep} />
            ))}
          </Stagger>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.58, ease: motionEase.emphasized }}
          className="relative z-10 rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-2xl backdrop-blur-3xl"
        >
          <div className="mb-6 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="ml-4 text-xs font-mono uppercase tracking-[0.22em] text-white/35">
              shell / live install path
            </span>
          </div>
          <pre className="overflow-x-auto rounded-[24px] bg-black/35 p-5 font-mono text-[13px] leading-relaxed whitespace-pre">
            <code className="text-emerald-400"># 1. Install YNX CLI</code>{"\n"}
            <code className="text-white">curl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash</code>{"\n"}
            <code className="text-white">export PATH="$HOME/.local/bin:$PATH"</code>{"\n\n"}
            <code className="text-emerald-400"># 2. Join as Full Node (State Sync)</code>{"\n"}
            <code className="text-white">ynx join --role full-node</code>{"\n\n"}
            <code className="text-emerald-400"># 3. Join as Validator Candidate</code>{"\n"}
            <code className="text-white">ynx join --role validator</code>
          </pre>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                {isEn ? "Why it matters" : "为什么重要"}
              </div>
              <p className="mt-3 text-sm leading-7 text-white/65">
                {isEn
                  ? "Infrastructure is only credible when an external builder can actually reach it and test it."
                  : "只有外部开发者真的能连上并测试，基础设施才算有可信度。"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                {isEn ? "Fast path" : "快速路径"}
              </div>
              <Link to="/testnet" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-klein hover:text-white">
                {isEn ? "View live testnet status" : "查看测试网实时状态"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AISettlementDemo() {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="border-y border-border/60 bg-white px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[40px] bg-ink p-8 text-white md:p-14">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "38px 38px",
            }}
          />
          <motion.div
            className="absolute -right-24 top-14 h-72 w-72 rounded-full bg-klein/25 blur-[90px]"
            animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-klein">
                {isEn ? "Official demo path" : "官方演示路径"}
              </div>
              <h2 className="mt-6 text-4xl font-display font-bold tracking-[-0.05em] md:text-6xl">
                {t("demo.title")}
              </h2>
              <p className="mt-6 text-lg leading-9 text-white/65">{t("demo.desc")}</p>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
                className="mt-10 space-y-6"
              >
                {[
                  {
                    id: "01",
                    title: t("demo.step1"),
                    desc: isEn
                      ? "Define spend limits and action rules on-chain."
                      : "在链上定义额度与动作规则。",
                  },
                  {
                    id: "02",
                    title: t("demo.step2"),
                    desc: isEn
                      ? "Issue time-bounded session keys to the agent."
                      : "向智能体发放时间受限的会话密钥。",
                  },
                  {
                    id: "03",
                    title: t("demo.step3"),
                    desc: isEn
                      ? "Protocol-enforced reward release upon proof."
                      : "在证明成立后由协议自动释放奖励。",
                  },
                ].map((step) => (
                  <motion.div
                    key={step.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="group flex gap-6"
                  >
                    <div className="text-2xl font-display font-bold leading-none text-white/20 transition-colors group-hover:text-klein">
                      {step.id}
                    </div>
                    <div>
                      <div className="mb-1 font-bold text-white">{step.title}</div>
                      <div className="text-sm leading-7 text-white/45">{step.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <Button
                size="xl"
                className="mt-10 rounded-2xl border-none bg-white text-klein shadow-[0_18px_60px_rgba(255,255,255,0.08)] hover:bg-surface"
                asChild
              >
                <Link to="/docs/en/ai-web4-official-demo">
                  {isEn ? "Explore demo docs" : "查看演示文档"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <motion.div
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/36 p-6 shadow-2xl backdrop-blur-xl"
              initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.52, ease: motionEase.emphasized }}
            >
              <SettlementFlow />
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/30">
                  {isEn ? "Workflow proof / finalized" : "工作流证明 / 已终态"}
                </span>
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.14 } } }}
                className="space-y-4 font-mono text-xs leading-relaxed"
              >
                <motion.div variants={revealSoft} className="text-emerald-400/80">
                  # Created Web4 Policy: wp_9x2j...
                </motion.div>
                <motion.div variants={revealSoft} className="text-blue-400/80">
                  # Issued Session Token: st_k0p1...
                </motion.div>
                <motion.div variants={revealSoft} className="text-white/60">
                  $ ynx ai-job create --reward 10.5anyxt
                </motion.div>
                <motion.div variants={revealSoft} className="border-l border-white/10 py-2 pl-4 italic text-white/40">
                  {"{"}
                  <br /> &nbsp;&nbsp;"job_id": "job_0x4f2a...",
                  <br /> &nbsp;&nbsp;"status": "COMMITTED",
                  <br /> &nbsp;&nbsp;"settlement": "PENDING_VERIFICATION"
                  <br /> {"}"}
                </motion.div>
                <motion.div variants={revealSoft} className="text-white/60">
                  $ ynx ai-job finalize job_0x4f2a...
                </motion.div>
                <motion.div
                  variants={revealSoft}
                  className="relative overflow-hidden rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3 text-emerald-300"
                >
                  <motion.span
                    className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "620%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  Success: Reward 10.5 ANYXT settled to Worker 0xac...
                </motion.div>
                <motion.div variants={revealSoft} className="mt-4 truncate border-t border-white/5 pt-4 text-white/30">
                  Evidence: output/ai_web4_demo/9102-run-001/final_state.json
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfrastructureOverview() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="bg-white px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="ynx-panel rounded-[32px] border border-klein/10 p-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/70">
            {isEn ? "Public infrastructure" : "公开基础设施"}
          </div>
          <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.05em] text-ink md:text-5xl">
            {isEn ? "Built to be understandable." : "不仅要能运行，也要能被理解。"}
          </h2>
          <p className="mt-6 text-lg leading-9 text-ink/65">
            {isEn
              ? "A credible network should expose how it is reached, what its public service surface looks like, and which layer a builder is interacting with."
              : "一个可信的网络，不只是能运行，还应该清楚暴露接入方式、公开服务表面，以及开发者正在接触的是哪一层。"}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: isEn ? "Hosting profile" : "托管形态", value: isEn ? "Public cluster" : "公共集群" },
              { title: "TLS Gateway", value: "Caddy / HTTPS" },
              { title: isEn ? "Networking" : "网络协议", value: "IPv4 / P2P Enabled" },
              { title: isEn ? "Open ports" : "开放端口", value: "80, 443, 36656" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-surface/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/35">
                  {item.title}
                </div>
                <div className="mt-2 text-lg font-semibold text-ink">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.26em] text-ink/35">
            {isEn ? "Public service endpoints" : "公共服务入口"}
          </div>
          {[
            { label: "Blockchain RPC", url: NETWORK.endpoints.rpc, icon: <Terminal className="h-4 w-4" /> },
            { label: "EVM Gateway", url: NETWORK.endpoints.evm, icon: <Cpu className="h-4 w-4" /> },
            { label: "Indexer Query", url: NETWORK.endpoints.indexer, icon: <Globe className="h-4 w-4" /> },
            { label: "AI Execution", url: NETWORK.endpoints.ai, icon: <Sparkles className="h-4 w-4" /> },
            { label: "Asset Faucet", url: NETWORK.endpoints.faucet, icon: <Download className="h-4 w-4" /> },
            { label: "Web4 Hub", url: NETWORK.endpoints.web4, icon: <Orbit className="h-4 w-4" /> },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-[24px] border border-border/70 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-klein/20 hover:shadow-[0_16px_60px_rgba(0,47,167,0.08)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-klein/10 bg-klein/5 p-3 text-klein">
                    {link.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-ink/85">{link.label}</div>
                    <code className="mt-1 block text-xs text-ink/45">{link.url}</code>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-ink/25 transition-all group-hover:text-klein group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function EndpointRow({ label, value, badge }: { label: string; value: string; badge: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={revealSoft}
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 p-4 transition-all hover:border-white/18 hover:bg-white/10"
    >
      <div className="min-w-0 pr-4">
        <div className="mb-1 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            {label}
          </span>
          <span className="rounded border border-klein/30 bg-klein/18 px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.18em] text-klein">
            {badge}
          </span>
        </div>
        <div className="truncate font-mono text-sm text-white/82">{value}</div>
      </div>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={copy}
        className="rounded-xl bg-white/5 p-2.5 text-white/40 transition-all hover:bg-klein hover:text-white active:scale-95"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </motion.button>
    </motion.div>
  );
}

function CapabilitiesOverview() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const caps = isEn
    ? [
        {
          icon: <Lock className="h-8 w-8 text-klein" />,
          title: "Policy and session control",
          desc: "Humans set permission boundaries first, then agents receive revocable authority inside those boundaries.",
          features: ["Owner-root controls", "Session expiry and revocation", "Explicit policy objects"],
        },
        {
          icon: <Sparkles className="h-8 w-8 text-klein" />,
          title: "AI settlement primitives",
          desc: "The lifecycle of an AI task can be recorded, challenged, and paid through protocol-enforced state transitions.",
          features: ["Job and worker registry", "Challenge or dispute windows", "Reward release on proof"],
        },
        {
          icon: <Cpu className="h-8 w-8 text-klein" />,
          title: "Machine-native payment rails",
          desc: "A cleaner path for service access, vault logic, and machine-to-machine transactions across Web4 environments.",
          features: ["Vault management", "Machine pay boundaries", "x402-shaped integration path"],
        },
      ]
    : [
        {
          icon: <Lock className="h-8 w-8 text-klein" />,
          title: "策略与会话控制",
          desc: "先由人类定义权限边界，再把受限且可撤销的权限授予智能体。",
          features: ["所有者根控制", "会话过期与撤销", "显式策略对象"],
        },
        {
          icon: <Sparkles className="h-8 w-8 text-klein" />,
          title: "AI 结算原语",
          desc: "AI 任务生命周期可以通过协议状态迁移被记录、质疑并完成支付。",
          features: ["任务与工作者注册", "挑战与争议窗口", "证明成立后释放奖励"],
        },
        {
          icon: <Cpu className="h-8 w-8 text-klein" />,
          title: "机器原生支付轨道",
          desc: "为服务访问、金库逻辑与机器间交易提供更清晰的 Web4 支付路径。",
          features: ["金库管理", "机器支付边界", "x402 形态兼容路径"],
        },
      ];

  return (
    <section className="bg-white px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-18 max-w-3xl text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/70">
            {isEn ? "Core primitives" : "核心原语"}
          </div>
          <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.05em] text-ink md:text-6xl">
            {isEn ? "Built around three things that matter." : "围绕三个真正重要的能力来构建。"}
          </h2>
          <p className="mt-6 text-lg font-light text-ink/60">
            {isEn
              ? "This is the shortest way to understand the product surface without reading every protocol document."
              : "这是在不读完全部协议文档的情况下，最快理解产品表面的方式。"}
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerSlow}
          className="grid gap-6 md:grid-cols-3"
        >
          {caps.map((cap) => (
            <motion.div key={cap.title} variants={revealSoft}>
              <TiltCard className="h-full">
                <div className="ynx-panel h-full rounded-[30px] border border-klein/10 p-8">
                  <div className="mb-8 flex w-fit rounded-3xl border border-klein/10 bg-klein/5 p-4 transition-all duration-500">
                    {cap.icon}
                  </div>
                  <h3 className="text-2xl font-display font-bold tracking-tight text-ink">{cap.title}</h3>
                  <p className="mt-4 leading-8 text-ink/62">{cap.desc}</p>
                  <div className="mt-8 space-y-3">
                    {cap.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-ink/78">
                        <div className="h-1.5 w-1.5 rounded-full bg-klein" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="bg-surface px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/70">
            {isEn ? "Readiness track" : "就绪轨道"}
          </div>
          <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.05em] text-ink md:text-6xl">
            {t("roadmap.title")}
          </h2>
        </div>
        <Roadmap />
      </div>
    </section>
  );
}

function FAQ() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const faqs = isEn
    ? [
        {
          q: "Is YNX compatible with MetaMask?",
          a: "Yes. YNX exposes a native EVM execution layer with JSON-RPC support and can be added with Chain ID 9102.",
        },
        {
          q: "What does AI settlement mean here?",
          a: "It means the task lifecycle itself can be expressed on-chain: permission, work commitment, verification, disputes, and reward release.",
        },
        {
          q: "Why does the homepage show live ops data?",
          a: "Because infrastructure trust should be earned through visible operating signals, not only through future promises.",
        },
      ]
    : [
        {
          q: "YNX 支持 MetaMask 吗？",
          a: "支持。YNX 提供原生 EVM 执行层和 JSON-RPC，可通过链 ID 9102 添加。",
        },
        {
          q: "这里说的 AI 结算是什么意思？",
          a: "指的是任务生命周期本身可以上链表达，包括授权、任务提交、验证、争议和奖励释放。",
        },
        {
          q: "为什么首页要展示实时运维数据？",
          a: "因为基础设施信任应该来自可见的运行信号，而不是只来自未来承诺。",
        },
      ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-klein/70">
            FAQ
          </div>
          <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.05em] text-ink md:text-5xl">
            {isEn ? "Questions a serious visitor will ask." : "真正会被认真问到的问题。"}
          </h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-[28px] border border-border/70 bg-surface/65 p-8">
              <h3 className="text-xl font-bold text-ink">{faq.q}</h3>
              <p className="mt-4 leading-8 text-ink/62">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="bg-klein px-6 py-32 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/55">
          {isEn ? "Start from the live surface" : "从真实运行表面开始"}
        </div>
        <h2 className="mt-6 text-5xl font-display font-bold tracking-[-0.06em] md:text-7xl">
          {isEn ? "See the network, then build on it." : "先看网络如何运行，再在其上构建。"}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/72">
          {isEn
            ? "Docs, testnet endpoints, and public operating signals are all available now."
            : "文档、测试网端点和公开运行信号现在都已经可用。"}
        </p>
        <div className="mt-14 flex flex-wrap justify-center gap-5 font-semibold">
          <Link
            to="/docs"
            className="rounded-2xl bg-white px-10 py-5 text-klein shadow-xl shadow-black/15 transition-all hover:scale-[1.02] hover:bg-surface"
          >
            {isEn ? "Read docs" : "阅读文档"}
          </Link>
          <Link
            to="/docs/en/ynx-ios-feature-manual"
            className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-10 py-5 text-white transition-all hover:scale-[1.02] hover:bg-white/14"
          >
            iOS Install Guide <Download className="h-5 w-5" />
          </Link>
          <a
            href={NETWORK.socials.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl bg-black px-10 py-5 text-white transition-all hover:scale-[1.02] hover:bg-ink"
          >
            {isEn ? "View on GitHub" : "查看 GitHub"} <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function RiskNotice() {
  const { language, t } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="bg-[linear-gradient(180deg,#081121_0%,#0a0f1c_100%)] px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <strong className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-klein/80">
            {isEn ? "Current public boundary" : "当前公开边界"}
          </strong>
          <p className="max-w-4xl text-sm leading-8 text-white/64 md:text-base">
            {isEn
              ? "YNX is currently a public-testnet infrastructure project. This site publishes real operational evidence, but it should not be read as proof that a legal operating entity, audited production controls, regulated financial services, or real-asset custody are already live."
              : "YNX 当前是公开测试网基础设施项目。这个网站展示的是真实运行证据，但不应被理解为已经具备法律运营主体、审计后的生产控制、受监管金融服务或真实资产托管能力。"}
          </p>
          <p className="mt-3 text-sm text-white/40">{t("footer.risk")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/risk"
            className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white/78 transition-colors hover:bg-white/8 hover:text-white"
          >
            {isEn ? "Risk" : "风险"}
          </Link>
          <Link
            to="/security"
            className="rounded-full border border-klein/30 bg-klein/12 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-klein/20"
          >
            {isEn ? "Security" : "安全"}
          </Link>
        </div>
      </div>
    </section>
  );
}
