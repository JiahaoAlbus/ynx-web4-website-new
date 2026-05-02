import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, ExternalLink, Terminal, Activity, Globe, Cpu, Link as LinkIcon, Box, Database, Server, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { TiltCard } from "../components/ui/TiltCard";
import { Magnetic } from "../components/ui/Magnetic";
import { Link } from "react-router-dom";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { NETWORK } from "../constants/network";

export function Testnet() {
  const { status, loading, error, refetch } = useNetworkStatus();

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

  return (
    <div className="pt-24 pb-32">
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-medium tracking-wide text-ink/70 uppercase">
                Public Infrastructure Active
              </span>
            </div>
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

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-border flex flex-col justify-between group hover:border-klein/30 hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-ink/50 uppercase tracking-widest font-bold">
                  {endpoint.label}
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(status?.[endpoint.id]?.status)} ${loading ? "animate-pulse" : ""}`} />
                  <span className={`text-[10px] font-mono font-bold uppercase ${getStatusColor(status?.[endpoint.id]?.status)}`}>
                    {status?.[endpoint.id]?.status || (loading ? 'checking' : 'unknown')}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="text-xs font-mono text-ink/70 truncate flex-1 bg-surface py-2 px-3 rounded-xl border border-border/50 select-all">
                  {endpoint.url}
                </code>
                <button
                  onClick={() => handleCopy(endpoint.url, index)}
                  className={`p-2 rounded-xl transition-all shrink-0 ${
                    copiedIndex === index 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "hover:bg-surface text-ink/40 hover:text-klein border border-transparent hover:border-border"
                  }`}
                >
                  {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <h2 className="text-3xl font-display font-bold mb-10">Current Network Topology</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface p-8 rounded-3xl border border-border">
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
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-border">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Globe className="text-emerald-500" />
              Global Validator Mesh
            </h3>
            <div className="space-y-4 font-mono text-sm px-4 py-3 bg-white rounded-2xl border border-border">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink/40">ynx-sv-v2-1</span>
                <span className="flex items-center gap-2">Active <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 rounded font-bold uppercase">Bonded</span></span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink/40">ynx-sv-v2-2</span>
                <span className="flex items-center gap-2">Active <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 rounded font-bold uppercase">Bonded</span></span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink/40">ynx-sv-v2-3</span>
                <span className="flex items-center gap-2">Active <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 rounded font-bold uppercase">Bonded</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/40">ynx-sv-v2-4</span>
                <span className="flex items-center gap-2">Active <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 rounded font-bold uppercase">Bonded</span></span>
              </div>
            </div>
            <p className="mt-6 text-sm text-ink/60">
              4 bonded validators are currently active and unjailed. External validators are encouraged to join via the install script to enhance network decentralization.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-32">
        <h2 className="text-3xl font-display font-bold mb-10">Verify the Network</h2>
        <div className="bg-ink text-white p-8 rounded-3xl shadow-2xl overflow-hidden relative">
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
        </div>
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
              link: "https://github.com/JiahaoAlbus/YNX/blob/main/docs/en/V2_DEPLOYMENT_PROFILE.md" 
            },
            { 
              title: "Faucet Docs", 
              desc: "Token faucet API and usage.", 
              link: "https://github.com/JiahaoAlbus/YNX/blob/main/docs/en/FAUCET.md" 
            },
          ].map((doc, i) => (
            <a key={i} href={doc.link} target="_blank" rel="noreferrer" className="bg-white border border-border p-6 rounded-2xl group hover:border-klein hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <Terminal className="text-ink/20 group-hover:text-klein transition-colors" />
                <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-klein group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-ink mb-2">{doc.title}</h4>
              <p className="text-xs text-ink/50 leading-relaxed">{doc.desc}</p>
            </a>
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
              <div key={i} className="bg-white border border-border p-6 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all">
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
                    className={`h-full ${svc?.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
