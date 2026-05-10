import { motion } from "motion/react";
import { ArrowRight, Shield, Zap, Globe, Code, Copy, Check, ExternalLink, Terminal, Cpu, Lock, Coins, Download } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useTranslation } from "../contexts/LanguageContext";
import { NetworkStatusGrid } from "../components/NetworkStatusGrid";
import { Roadmap } from "../components/Roadmap";
import { NETWORK } from "../constants/network";
import { ExecutionFlow } from "../components/motion/ExecutionFlow";
import { KineticGrid } from "../components/motion/KineticGrid";
import { SettlementFlow } from "../components/motion/SettlementFlow";
import { Stagger } from "../components/motion/Reveal";
import { motionEase, revealSoft, staggerSlow } from "../lib/motion";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-6 w-full -mt-16 relative z-10 mb-24">
        <NetworkStatusGrid />
      </div>
      <DeveloperSection />
      <CapabilitiesOverview />
      <RoadmapSection />
      <AISettlementDemo />
      <InfrastructureOverview />
      <SovereigntyOrder />
      <FAQ />
      <FinalCTA />
      <RiskNotice />
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  
  return (
    <section className="pt-40 pb-32 px-6 bg-gradient-to-b from-surface to-white border-b border-border/50 overflow-hidden relative">
      <KineticGrid />
      <ExecutionFlow />
      <motion.div
        className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-klein/20 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: motionEase.emphasized }}
      />
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.42, ease: motionEase.emphasized }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-klein/5 border border-klein/10 text-klein text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-klein animate-pulse" />
            {t("hero.badge")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: motionEase.emphasized }}
            className="text-6xl md:text-8xl font-display font-bold text-ink leading-[0.95] tracking-tighter mb-8"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.52, ease: motionEase.standard }}
            className="text-xl md:text-2xl text-ink/70 leading-relaxed mb-12 max-w-3xl font-light"
          >
            {t("hero.subtitle")}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.48, ease: motionEase.standard }}
            className="flex flex-wrap items-center gap-6 mb-16"
          >
            <Button size="xl" className="group relative overflow-hidden shadow-2xl shadow-klein/30 before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:skew-x-[-18deg] before:bg-white/20 before:opacity-0 before:transition-all before:duration-700 hover:before:left-[120%] hover:before:opacity-100" asChild>
              <a href={NETWORK.endpoints.explorer} target="_blank" rel="noreferrer">
                {t("hero.cta.explorer")}
                <ExternalLink className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="xl" variant="outline" className="group relative overflow-hidden hover:shadow-xl hover:shadow-klein/10" asChild>
              <Link to="/docs/en/ai-web4-official-demo">
                {t("hero.cta.build")}
                <Zap className="ml-2 w-5 h-5 opacity-40 group-hover:opacity-100 transition-all text-amber-500" />
              </Link>
            </Button>
            <Button size="xl" variant="ghost" className="group hover:bg-klein/5" asChild>
              <Link to="/testnet">
                {t("hero.cta.join")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="group relative overflow-hidden bg-white/80" asChild>
              <a href="/downloads/YNX-iOS-Simulator-Preview.zip" download>
                Download iOS Simulator Preview
                <Download className="ml-2 w-5 h-5 opacity-50 group-hover:opacity-100 transition-all" />
              </a>
            </Button>
            <Button size="xl" variant="outline" className="group relative overflow-hidden bg-white/80" asChild>
              <a href="/downloads/YNX-Android-Preview.apk" download>
                Download Android APK
                <Download className="ml-2 w-5 h-5 opacity-50 group-hover:opacity-100 transition-all" />
              </a>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-12 gap-y-6 pt-12 border-t border-border/50"
          >
            {[
              { label: "Network State", value: "Public Testnet Live" },
              { label: "Execution Layer", value: t("hero.stats.chain") },
              { label: "Consensus Hub", value: t("hero.stats.nodes") },
              { label: "Protocol Track", value: "v2-web4-stable" },
              { label: "iOS Build", value: "Updated May 10, 2026" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex flex-col"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.34, ease: motionEase.standard }}
              >
                <span className="text-[10px] uppercase font-bold text-ink/40 tracking-widest mb-1">{stat.label}</span>
                <span className="text-sm font-mono font-bold text-ink/80">{stat.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DeveloperSection() {
  const { t } = useTranslation();
  
  const endpoints = [
    { label: t("dev.rpc"), value: NETWORK.endpoints.rpc, badge: "Cosmos" },
    { label: "gRPC", value: NETWORK.endpoints.grpc, badge: "Remote" },
    { label: t("dev.evm"), value: NETWORK.endpoints.evm, badge: "Ethereum" },
    { label: t("dev.chain_id"), value: NETWORK.evmChainId, badge: "9102" },
    { label: t("dev.faucet"), value: NETWORK.endpoints.faucet, badge: "Free Token" },
  ];

  return (
    <section className="py-32 bg-ink text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0062ff_0,transparent_50%)]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerSlow}>
            <motion.div variants={revealSoft}>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              {t("dev.title")}
            </h2>
            <p className="text-xl text-white/70 leading-relaxed mb-12">
              {t("dev.desc")}
            </p>
            
            </motion.div>
            <Stagger className="space-y-4">
              {endpoints.map((ep, i) => (
                <EndpointRow key={i} {...ep} />
              ))}
            </Stagger>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.58, ease: motionEase.emphasized }}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-4 text-xs font-mono text-white/40 uppercase tracking-widest">shell — one-click install</span>
            </div>
            <pre className="font-mono text-[13px] overflow-x-auto p-4 bg-black/40 rounded-xl leading-relaxed whitespace-pre">
              <code className="text-emerald-400"># 1. Install YNX CLI Tool</code>{"\n"}
              <code className="text-white">curl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash</code>{"\n"}
              <code className="text-white">export PATH="$HOME/.local/bin:$PATH"</code>{"\n\n"}
              <code className="text-emerald-400"># 2. Join as Full Node (State Sync)</code>{"\n"}
              <code className="text-white">ynx join --role full-node</code>{"\n\n"}
              <code className="text-emerald-400"># 3. Join as Validator Candidate</code>{"\n"}
              <code className="text-white">ynx join --role validator</code>
            </pre>
            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <p className="text-xs text-white/60 leading-relaxed italic">
                  Public testnet joins default to state sync. New machines should not replay old genesis history; they sync from the live network snapshot.
                </p>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} className="text-klein" />
                  Global Public Hub
                </span>
                <Link to="/testnet" className="text-klein text-xs font-bold hover:underline">View Status →</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AISettlementDemo() {
  const { t } = useTranslation();
  
  return (
    <section className="py-32 bg-white border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-ink rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden">
          {/* Decorative mesh background */}
          <motion.div
               className="absolute inset-0 opacity-10 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <motion.div
            className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-klein/25 blur-[90px]"
            animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-klein mb-6 border border-white/5">
                Official Demo Path
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                {t("demo.title")}
              </h2>
              <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
                {t("demo.desc")}
              </p>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                className="space-y-6 mb-12"
              >
                {[
                  { id: "01", title: t("demo.step1"), desc: "Define spend limits and action rules on-chain." },
                  { id: "02", title: t("demo.step2"), desc: "Issue time-bounded session keys to the agent." },
                  { id: "03", title: t("demo.step3"), desc: "Protocol-enforced reward release upon proof." }
                ].map((step, i) => (
                  <motion.div 
                    key={i} 
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className="flex gap-6 group"
                  >
                    <div className="text-2xl font-display font-bold text-white/20 group-hover:text-klein transition-colors leading-none">{step.id}</div>
                    <div>
                      <div className="font-bold text-white mb-1">{step.title}</div>
                      <div className="text-sm text-white/40 leading-relaxed">{step.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <Button size="xl" className="bg-white text-klein hover:bg-surface border-none shadow-2xl shadow-white/5" asChild>
                <Link to="/docs/en/ai-web4-official-demo">
                  Explore Demo Docs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <motion.div
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-3xl relative overflow-hidden"
              initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.52, ease: motionEase.emphasized }}
            >
              <SettlementFlow />
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Workflow Proof — Finalized</span>
                <Check className="text-emerald-400 w-4 h-4" />
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.14 } } }}
                className="space-y-4 font-mono text-xs leading-relaxed"
              >
                <motion.div variants={revealSoft} className="text-emerald-400/80"># Created Web4 Policy: wp_9x2j...</motion.div>
                <motion.div variants={revealSoft} className="text-blue-400/80"># Issued Session Token: st_k0p1...</motion.div>
                <motion.div variants={revealSoft} className="text-white/60">$ ynx ai-job create --reward 10.5anyxt</motion.div>
                <motion.div variants={revealSoft} className="pl-4 py-2 border-l border-white/10 text-white/40 italic">
                  {"{"}
                  <br /> &nbsp;&nbsp;"job_id": "job_0x4f2a...",
                  <br /> &nbsp;&nbsp;"status": "COMMITTED",
                  <br /> &nbsp;&nbsp;"settlement": "PENDING_VERIFICATION"
                  <br /> {"}"}
                </motion.div>
                <motion.div variants={revealSoft} className="text-white/60">$ ynx ai-job finalize job_0x4f2a...</motion.div>
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
                <motion.div variants={revealSoft} className="text-white/30 truncate mt-4 border-t border-white/5 pt-4">
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
  const { t, language } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-8">{isEn ? "Cloud Infrastructure" : "基础设施架构"}</h2>
            <p className="text-xl text-ink/60 mb-12">
              {isEn 
                ? "The YNX Web4 public track is currently deployed on high-performance infrastructure for optimal execution and global connectivity."
                : "YNX Web4 公测赛道目前部署于高可用基础设施，提供高性能执行环境与全球化网络连接。"}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: isEn ? "Hosting Profile" : "托管配置", value: isEn ? "Public Cluster" : "公共集群" },
                { title: isEn ? "TLS Gateway" : "入口网关", value: "Caddy / HTTPS" },
                { title: isEn ? "Networking" : "网络协议", value: "IPv4 / P2P Enabled" },
                { title: isEn ? "Open Ports" : "开放端口", value: "80, 443, 36656" },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-surface rounded-2xl border border-border">
                  <div className="text-xs font-bold uppercase text-ink/40 mb-1">{item.title}</div>
                  <div className="text-lg font-semibold text-ink">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink/40 mb-6">{isEn ? "Public Service Endpoints" : "公共服务入口"}</h3>
            <div className="grid gap-3">
              {[
                { label: "Blockchain RPC", url: NETWORK.endpoints.rpc },
                { label: "EVM Gateway", url: NETWORK.endpoints.evm },
                { label: "Indexer Query", url: NETWORK.endpoints.indexer },
                { label: "AI Execution", url: NETWORK.endpoints.ai },
                { label: "Asset Faucet", url: NETWORK.endpoints.faucet },
                { label: "Web4 Hub", url: NETWORK.endpoints.web4 },
              ].map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-klein transition-all group"
                >
                  <span className="font-semibold text-ink/80">{link.label}</span>
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-mono text-ink/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">{link.url}</code>
                    <ExternalLink size={16} className="text-ink/20 group-hover:text-klein" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EndpointRow({ label, value, badge }: { label: string, value: string, badge: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div variants={revealSoft} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:bg-white/10 hover:border-white/20">
      <div className="min-w-0 pr-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{label}</span>
          <span className="px-1.5 py-px rounded bg-klein/20 text-klein text-[9px] font-bold uppercase tracking-widest border border-klein/30">{badge}</span>
        </div>
        <div className="text-sm font-mono text-white/80 truncate">{value}</div>
      </div>
      <motion.button whileTap={{ scale: 0.92 }} onClick={copy} className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-klein transition-all active:scale-95">
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </motion.button>
    </motion.div>
  );
}

function CapabilitiesOverview() {
  const { t } = useTranslation();
  
  const caps = [
    {
      icon: <Lock className="w-8 h-8 text-klein" />,
      title: "Policy & Session",
      desc: "Layered sovereignty: Humans set the spend limits and time-bounded permissions; AI agents execute within those boundaries.",
      features: ["Owner-Root Controls", "JSON-Policy Registry", "Revocable Sessions"]
    },
    {
      icon: <Cpu className="w-8 h-8 text-klein" />,
      title: "AI Settlement",
      desc: "Native primitives for decentralized AI workforce coordination. Automated job lifecycle with challenge-reveal dispute periods.",
      features: ["Job/Worker Registry", "Slashing Primitives", "Result Verification"]
    },
    {
      icon: <Coins className="w-8 h-8 text-klein" />,
      title: "Web4 Machine Pay",
      desc: "Standardized machine-to-machine payment vaults. Support for x402 resource access gates and per-task settlement.",
      features: ["Vault Management", "x402 Shape Ready", "Programmable Charges"]
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-ink mb-8 leading-tight">
            {t("caps.title")}
          </h2>
          <p className="text-xl text-ink/60 font-light">
            {t("caps.desc")}
          </p>
        </div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerSlow}
          className="grid md:grid-cols-3 gap-12"
        >
          {caps.map((cap, i) => (
            <motion.div 
              key={i}
              variants={revealSoft}
              className="group"
            >
              <motion.div
                className="mb-8 p-4 bg-surface rounded-3xl w-fit group-hover:bg-klein/5 transition-all duration-500"
                whileHover={{ scale: 1.08, rotate: -2 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                {cap.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-ink mb-4">{cap.title}</h3>
              <p className="text-ink/60 leading-relaxed mb-8">
                {cap.desc}
              </p>
              <ul className="space-y-3">
                {cap.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-semibold text-ink/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-klein" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-ink mb-8 leading-tight">
            {t("roadmap.title")}
          </h2>
        </div>
        <Roadmap />
      </div>
    </section>
  );
}

function SovereigntyOrder() {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              Absolute Human Sovereignty
            </h2>
            <p className="text-xl text-white/70 font-light leading-relaxed mb-12">
              In the AI-native future, autonomy without accountability is dangerous. YNX enforces a hierarchy where human intent always overrides machine action.
            </p>
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-xs font-mono font-bold text-white/30 uppercase tracking-widest vertical-rl transform rotate-180">Protocol Invariant</div>
              <div className="text-sm italic text-white/80 border-l border-white/20 pl-6">
                "An agent MUST NOT execute any action that violates the bounds set by its parent Policy, even if it has a valid Session token."
              </div>
            </div>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-4"
          >
            {[
              { title: "1. Owner (Root)", desc: "The human user with recovery authority." },
              { title: "2. Policy (Immutable Constraint)", desc: "Hard-coded rules on-chain for the agent's life." },
              { title: "3. Session (Time-Limited Key)", desc: "A fleeting capability delegated to an agent." },
              { title: "4. Agent Action", desc: "Verifiable execution on the YNX chain." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: motionEase.standard } } }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all"
              >
                <div>
                  <div className="text-lg font-bold text-white mb-1">{item.title}</div>
                  <div className="text-sm text-white/40">{item.desc}</div>
                </div>
                <ArrowRight className="text-klein opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useTranslation();
  const faqs = [
    {
      q: "Is YNX compatible with MetaMask?",
      a: "Yes. YNX features a native EVM execution layer with full JSON-RPC support. You can add it using Chain ID 9102."
    },
    {
      q: "What does AI Settlement mean?",
      a: "It means the economic lifecycle of an AI task—payment, lockup, proof verification, and dispute—is handled on-chain."
    },
    {
      q: "When is the Mainnet launch?",
      a: "Mainnet is gated by Phase 2 stress testing and external security audits. Current target is late 2026."
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-ink mb-6">FAQ</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-8 rounded-3xl bg-surface border border-border">
              <h3 className="text-xl font-bold text-ink mb-4">{faq.q}</h3>
              <p className="text-ink/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { t } = useTranslation();
  return (
    <section className="py-40 bg-klein text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-10 tracking-tight leading-none">
          Build the Web4 <br /> Economy Today.
        </h2>
        <div className="flex flex-wrap justify-center gap-6 mt-16 font-semibold">
          <Link to="/docs" className="px-10 py-5 bg-white text-klein rounded-2xl hover:scale-105 hover:bg-surface transition-all shadow-xl shadow-black/20">
            Read Docs
          </Link>
          <a href="/downloads/YNX-iOS-Simulator-Preview.zip" download className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl hover:scale-105 hover:bg-white/15 transition-all inline-flex items-center gap-3">
            Download iOS Simulator Preview <Download size={20} />
          </a>
          <a href="/downloads/YNX-Android-Preview.apk" download className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl hover:scale-105 hover:bg-white/15 transition-all inline-flex items-center gap-3">
            Download Android APK <Download size={20} />
          </a>
          <a href={NETWORK.socials.github} target="_blank" rel="noreferrer" className="px-10 py-5 bg-black text-white rounded-2xl hover:scale-105 hover:bg-ink transition-all inline-flex items-center gap-3">
             View on GitHub <ExternalLink size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}

function RiskNotice() {
  const { t } = useTranslation();
  return (
    <div className="bg-ink text-white/30 py-12 text-sm text-center px-6">
      <div className="max-w-3xl mx-auto leading-relaxed">
        <strong className="text-white/60 block mb-2 uppercase tracking-widest text-[10px]">Security Notice</strong>
        {t("footer.risk")}
      </div>
    </div>
  );
}
