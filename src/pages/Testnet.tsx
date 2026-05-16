import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, ExternalLink, Terminal, Activity, Globe, Cpu, Link as LinkIcon, Box, Database, Server, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { TiltCard } from "../components/ui/TiltCard";
import { Magnetic } from "../components/ui/Magnetic";
import { Link } from "react-router-dom";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useValidatorReadiness } from "../hooks/useValidatorReadiness";
import { NETWORK } from "../constants/network";
import { motionEase, revealSoft, stagger } from "../lib/motion";
import { SignalRail } from "../components/motion/SignalRail";

export function Testnet() {
  const { status, loading, error, refetch } = useNetworkStatus();
  const { snapshot, loading: validatorLoading } = useValidatorReadiness();

  const endpoints = [
    { label: "RPC", url: NETWORK.endpoints.rpc, id: 'rpc' },
    { label: "gRPC", url: NETWORK.endpoints.grpc, id: 'grpc' },
    { label: "EVM RPC", url: NETWORK.endpoints.evm, id: 'evm' },
    { label: "Faucet", url: NETWORK.endpoints.faucet, id: 'faucet' },
    { label: "Indexer", url: NETWORK.endpoints.indexer, id: 'indexer' },
    { label: "Explorer", url: NETWORK.endpoints.explorer, id: 'explorer' },
    { label: "AI Gateway", url: NETWORK.endpoints.ai, id: 'ai' },
    { label: "Web4 Hub", url: NETWORK.endpoints.web4, id: 'web4' },
  ];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getStatusColor = (svcStatus?: string) => {
    if (svcStatus === 'online') return 'text-emerald-600';
    if (svcStatus === 'degraded') return 'text-amber-600';
    if (svcStatus === 'offline') return 'text-rose-600';
    return 'text-ink/40';
  };

  const getStatusDot = (svcStatus?: string) => {
    if (svcStatus === 'online') return 'bg-emerald-500';
    if (svcStatus === 'degraded') return 'bg-amber-500';
    if (svcStatus === 'offline') return 'bg-rose-500';
    return 'bg-ink/20';
  };

  const validatorRows = snapshot?.validators.slice(0, 6) ?? [];
  const validatorGateLabel = snapshot
    ? snapshot.validator_gate_pass
      ? "Validator Gate Passed"
      : `Validator Gate Pending (${snapshot.bonded_count}/${snapshot.min_validators})`
    : validatorLoading
      ? "Checking Validator Gate"
      : "Validator Gate Unavailable";
  const networkSummary = status?.summary;
  const infrastructureLabel =
    networkSummary === "online"
      ? "Public Infrastructure Online"
      : networkSummary === "degraded"
        ? "Public Infrastructure Degraded"
        : networkSummary === "offline"
          ? "Public Infrastructure Offline"
          : "Checking Public Infrastructure";
  const infrastructureDot =
    networkSummary === "online"
      ? "bg-emerald-500"
      : networkSummary === "degraded"
        ? "bg-amber-500"
        : networkSummary === "offline"
          ? "bg-rose-500"
          : "bg-ink/30";

  return (
    <div className="pt-24 pb-32">
      <section className="relative py-20 px-6 overflow-hidden">
        <SignalRail density="active" className="opacity-75" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border mb-6 shadow-sm"
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.18 }}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${infrastructureDot} opacity-60`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${infrastructureDot}`}></span>
              </span>
              <span className="text-xs font-mono font-medium tracking-wide text-ink/70 uppercase">
                {infrastructureLabel}
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink mb-6">
              Network <span className="text-klein">Status</span>
            </h1>
            <p className="text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed mb-10">
              The YNX Web4 public testnet is live. High-assurance execution for humans and AI agents.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-8 mb-32">
        <TiltCard className="lg:col-span-1 h-full">
          <div className="bg-ink text-white p-8 rounded-3xl h-full flex flex-col justify-between shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-klein/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-semibold mb-8 flex items-center gap-3">
                <Activity className="text-emerald-400" />
                Chain Specs
              </h3>
              <div className="space-y-8">
                <div>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">Cosmos Chain ID</span>
                  <span className="text-2xl font-mono tracking-tight text-white">{NETWORK.chainId}</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">EVM Chain ID</span>
                  <span className="text-2xl font-mono tracking-tight text-white">{NETWORK.evmChainId}</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">Denom</span>
                  <span className="text-2xl font-mono tracking-tight text-white">{NETWORK.denom}</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">Validator Gate</span>
                  <span className={`text-sm font-mono tracking-tight ${snapshot?.validator_gate_pass ? "text-emerald-300" : "text-amber-300"}`}>
                    {validatorGateLabel}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 space-y-4 relative z-10">
              <Magnetic>
                <Button variant="klein" className="w-full justify-between h-14 rounded-2xl group shadow-lg shadow-klein/20" asChild>
                  <a href={NETWORK.endpoints.explorer} target="_blank" rel="noreferrer">
                    View Explorer
                    <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button variant="outline" className="w-full justify-between h-14 rounded-2xl group bg-white/5 border-white/10 text-white hover:bg-white/10" asChild>
                  <Link to="/docs">
                    Read Documentation
                    <Terminal className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </div>
        </TiltCard>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="lg:col-span-2 grid sm:grid-cols-2 gap-4"
        >
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.label}
              variants={revealSoft}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.18, ease: motionEase.standard }}
              className="bg-white p-6 rounded-2xl border border-border flex flex-col justify-between group hover:border-klein/30 hover:shadow-xl transition-all relative overflow-hidden"
            >
              <motion.div
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-klein/0 blur-2xl group-hover:bg-klein/10"
                animate={status?.[endpoint.id]?.status === "online" ? { opacity: [0.2, 0.7, 0.2], scale: [1, 1.18, 1] } : undefined}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.09 }}
              />
              {status?.[endpoint.id]?.status === "online" && (
                <motion.div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-klein to-transparent"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
                />
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-ink/50 uppercase tracking-widest font-bold">
                  {endpoint.label}
                </span>
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${getStatusDot(status?.[endpoint.id]?.status)} ${loading ? "animate-pulse" : ""}`}
                    animate={status?.[endpoint.id]?.status === "online" ? { scale: [1, 1.7, 1], opacity: [1, 0.65, 1] } : undefined}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className={`text-[10px] font-mono font-bold uppercase ${getStatusColor(status?.[endpoint.id]?.status)}`}>
                    {status?.[endpoint.id]?.status || (loading ? 'checking' : 'unknown')}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="text-xs font-mono text-ink/70 truncate flex-1 bg-surface py-2 px-3 rounded-xl border border-border/50 select-all">
                  {endpoint.url}
                </code>
                <motion.button
                  onClick={() => handleCopy(endpoint.url, index)}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ y: -1 }}
                  className={`p-2 rounded-xl transition-all shrink-0 ${
                    copiedIndex === index 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "hover:bg-surface text-ink/40 hover:text-klein border border-transparent hover:border-border"
                  }`}
                >
                  <motion.span
                    key={copiedIndex === index ? "copied" : "copy"}
                    initial={{ scale: 0.72, rotate: -8, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 520, damping: 24 }}
                    className="block"
                  >
                    {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <h2 className="text-3xl font-display font-bold mb-10">Current Network Topology</h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-8"
        >
          <motion.div variants={revealSoft} whileHover={{ y: -5 }} className="bg-surface p-8 rounded-3xl border border-border relative overflow-hidden group">
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-klein to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ["-120%", "120%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Server className="text-klein" />
              Main Public Hub
            </h3>
            <div className="space-y-4 font-mono text-sm px-4 py-3 bg-white rounded-2xl border border-border">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink/40">ynx-v2-main</span>
                <span className="flex items-center gap-2">Live <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 rounded font-bold uppercase">Sentry</span></span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink/40">ynx-v2-rpc</span>
                <span>TLS Gateway</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/40">ynx-v2-p2p</span>
                <span>Port 36656</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-ink/60">
              The main public hub utilizes a high-performance proxy for secure TLS termination and provides entry shards for new testnet participants.
            </p>
          </motion.div>

          <motion.div variants={revealSoft} whileHover={{ y: -5 }} className="bg-surface p-8 rounded-3xl border border-border relative overflow-hidden group">
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ["-120%", "120%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Globe className="text-emerald-500" />
              Global Validator Mesh
            </h3>
            <div className="space-y-4 font-mono text-sm px-4 py-3 bg-white rounded-2xl border border-border">
              {validatorRows.length === 0 ? (
                <div className="text-ink/60">
                  {validatorLoading ? "Loading live validator set..." : "Validator snapshot unavailable."}
                </div>
              ) : (
                validatorRows.map((validator, idx) => (
                  <div
                    key={validator.operator}
                    className={`flex justify-between ${idx < validatorRows.length - 1 ? "border-b border-border/50 pb-2" : ""}`}
                  >
                    <span className="text-ink/40 truncate pr-3">{validator.moniker || validator.operator}</span>
                    <span className="flex items-center gap-2">
                      {validator.jailed ? "Jailed" : "Active"}
                      <span
                        className={`text-[10px] px-1.5 rounded font-bold uppercase ${
                          validator.jailed
                            ? "bg-rose-100 text-rose-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {validator.jailed ? "Jailed" : "Bonded"}
                      </span>
                    </span>
                  </div>
                ))
              )}
            </div>
            <p className="mt-6 text-sm text-ink/60">
              {snapshot
                ? `${snapshot.bonded_count} bonded validators are currently active, ${snapshot.unjailed_count} are unjailed. Mainnet gate target is at least ${snapshot.min_validators} bonded validators.`
                : "Validator set is fetched from live REST and indexer endpoints. External validators are encouraged to join to improve decentralization."}
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <h2 className="text-3xl font-display font-bold mb-10">Verify the Network</h2>
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.52, ease: motionEase.emphasized }}
          className="bg-ink text-white p-8 rounded-3xl shadow-2xl overflow-hidden relative"
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-4 text-xs font-mono text-white/40 uppercase tracking-widest">terminal — live check</span>
          </div>
          <pre className="font-mono text-sm leading-relaxed overflow-x-auto p-4 bg-black/40 rounded-2xl border border-white/5 whitespace-pre">
            <code className="text-emerald-400"># Check Chain Status</code>{"\n"}
            <code className="text-white">curl -s https://rpc.ynxweb4.com/status | jq -r '.result.node_info.network,.result.sync_info.latest_block_height,.result.sync_info.catching_up'</code>{"\n\n"}
            <code className="text-emerald-400"># Check Infrastructure Health</code>{"\n"}
            <code className="text-white">curl -s https://faucet.ynxweb4.com/health | jq</code>{"\n"}
            <code className="text-white">curl -s https://indexer.ynxweb4.com/ynx/overview | jq</code>{"\n\n"}
            <code className="text-emerald-400"># Check Web4 Readiness</code>{"\n"}
            <code className="text-white">curl -s https://ai.ynxweb4.com/ready | jq</code>{"\n"}
            <code className="text-white">curl -s https://web4.ynxweb4.com/ready | jq</code>
          </pre>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <h2 className="text-3xl font-display font-bold mb-10">Canonical Documentation</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Testnet Join Guide", 
              desc: "Step-by-step for full nodes.", 
              link: "https://github.com/JiahaoAlbus/YNX/blob/main/docs/en/V2_PUBLIC_TESTNET_JOIN_GUIDE.md" 
            },
            { 
              title: "Consensus Validator", 
              desc: "How to become a bonded validator.", 
              link: "https://github.com/JiahaoAlbus/YNX/blob/main/docs/en/V2_CONSENSUS_VALIDATOR_JOIN_GUIDE.md" 
            },
            { 
              title: "Deployment Profile", 
              desc: "Public track infrastructure details.", 
              link: "https://github.com/JiahaoAlbus/YNX/blob/main/docs/en/V2_GCP_CURRENT_DEPLOYMENT_PROFILE.md"
            },
            { 
              title: "Faucet Docs", 
              desc: "Token faucet API and usage.", 
              link: "https://github.com/JiahaoAlbus/YNX/blob/main/docs/en/FAUCET.md" 
            },
          ].map((doc, i) => (
            <motion.a
              key={i}
              href={doc.link}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -6, scale: 1.012 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.18, ease: motionEase.standard }}
              className="bg-white border border-border p-6 rounded-2xl group hover:border-klein hover:shadow-xl transition-all relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-klein to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              />
              <div className="flex items-center justify-between mb-4">
                <Terminal className="text-ink/20 group-hover:text-klein transition-colors" />
                <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-klein group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-ink mb-2">{doc.title}</h4>
              <p className="text-xs text-ink/50 leading-relaxed">{doc.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold">Monitoring Cluster</h2>
          <Button variant="ghost" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "RPC Stack", id: 'rpc', icon: <Server className="w-5 h-5" /> },
            { label: "Engine Layer", id: 'evm', icon: <Cpu className="w-5 h-5" /> },
            { label: "Query Indexer", id: 'indexer', icon: <Box className="w-5 h-5" /> },
            { label: "Faucet Service", id: 'faucet', icon: <Database className="w-5 h-5" /> },
            { label: "Gateway AI", id: 'ai', icon: <Cpu className="w-5 h-5" /> },
            { label: "Hub Web4", id: 'web4', icon: <LinkIcon className="w-5 h-5" /> },
          ].map((item, i) => {
            const svc = status?.[item.id];
            return (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.012 }}
                transition={{ duration: 0.18, ease: motionEase.standard }}
                className="bg-white border border-border p-6 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-klein to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                />
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-surface rounded-xl text-ink/40">{item.icon}</div>
                  <div className={`text-[10px] font-mono font-bold uppercase ${getStatusColor(svc?.status || 'offline')}`}>
                    {svc?.status || 'checking'}
                  </div>
                </div>
                <div className="font-bold text-ink">{item.label}</div>
                <div className="h-1 bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: svc?.status === 'online' ? '100%' : '20%' }}
                    transition={{ duration: 0.65, ease: motionEase.emphasized }}
                    className={`h-full ${svc?.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
