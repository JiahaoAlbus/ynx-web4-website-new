import { motion } from "motion/react";
import { Terminal, ArrowRight, Code2, Box, Layers, Copy, Check, Globe, Cpu } from "lucide-react";
import { Button } from "../components/ui/button";
import { TiltCard } from "../components/ui/TiltCard";
import { Magnetic } from "../components/ui/Magnetic";
import { useState } from "react";
import { Link } from "react-router-dom";
import { NETWORK } from "../constants/network";

function BuildPathCard({ icon, title, desc, features, link }: { icon: any, title: string, desc: string, features: string[], link: string }) {
  return (
    <TiltCard className="h-full">
      <motion.div className="p-8 bg-surface border border-border rounded-[32px] h-full hover:border-klein/30 transition-all flex flex-col">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-klein mb-8 shadow-sm border border-border/50">
          {icon}
        </div>
        <h3 className="text-2xl font-display font-bold mb-4">{title}</h3>
        <p className="text-ink/60 leading-relaxed mb-8 flex-1">{desc}</p>
        <div className="space-y-3 mb-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-mono font-bold text-ink/40 uppercase tracking-tighter">
              <div className="w-1 h-1 rounded-full bg-klein/40" />
              {f}
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full justify-between" asChild>
          <a href={link} target="_blank" rel="noreferrer">
            Endpoint API
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </a>
        </Button>
      </motion.div>
    </TiltCard>
  );
}

export function Builders() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`// hardhat.config.ts
export default {
  networks: {
    ynx_testnet: {
      url: "https://evm.ynxweb4.com",
      chainId: 9102,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-40 pb-32">
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
              For Developers
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink mb-6">
              Build on the <br />
              <span className="text-klein">Execution Layer</span>
            </h1>
            <p className="text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed mb-10">
              YNX offers an EVM-first surface with native Web4 primitives. Deploy your existing Solidity contracts or build autonomous agents with policy-bounded execution.
            </p>
            <div className="flex justify-center gap-4">
              <Magnetic>
                <Button variant="klein" size="lg" asChild>
                  <Link to="/docs/en/public-testnet-join">
                    Read the Docs
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://explorer.ynxweb4.com" target="_blank" rel="noreferrer">
                    <Globe className="mr-2 w-4 h-4" />
                    View Explorer
                  </a>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button variant="ghost" size="lg" asChild>
                  <a href="https://github.com/JiahaoAlbus/YNX" target="_blank" rel="noreferrer">
                    <Terminal className="mr-2 w-4 h-4" />
                    GitHub
                  </a>
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-32">
        <BuildPathCard 
          icon={<Code2 className="w-8 h-8" />}
          title="EVM Developers"
          desc="Solidity / Hardhat / Foundry via EVM RPC. Full Ethereum-grade compatibility."
          features={["Chain ID 9102", "Geth-compatible RPC", "High-throughput execution"]}
          link={NETWORK.endpoints.evm}
        />
        <BuildPathCard 
          icon={<Cpu className="w-8 h-8" />}
          title="AI Agent Developers"
          desc="Programmatic job lifecycle, machine-payment vaults, and x402 resource flows."
          features={["/ai/jobs", "/ai/vaults", "/ai/payments"]}
          link={NETWORK.endpoints.ai}
        />
        <BuildPathCard 
          icon={<Layers className="w-8 h-8" />}
          title="Web4 Developers"
          desc="Bounded autonomy through owner policies, session delegation, and intents."
          features={["/web4/policies", "/web4/sessions", "/web4/audit"]}
          link={NETWORK.endpoints.web4}
        />
      </section>

      <section className="bg-ink text-white py-24 relative overflow-hidden rounded-3xl mx-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,47,167,0.2),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Quick Start</h2>
              <p className="text-white/60 mb-8 text-lg">
                Connect to the public testnet and deploy your first contract in minutes.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Add Network", desc: "Configure your wallet with Chain ID 9102." },
                  { title: "Get Funds", desc: "Request anyxt from the testnet faucet." },
                  { title: "Deploy", desc: "Use Hardhat or Foundry with the RPC endpoint." }
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-klein/20 text-white flex items-center justify-center shrink-0 text-sm font-mono border border-klein/30 group-hover:bg-klein group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 group-hover:text-klein transition-colors">{step.title}</h4>
                      <p className="text-white/60 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 space-y-4">
                <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Quick Checks</p>
                <div className="space-y-3">
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed group relative">
                    <code className="text-emerald-400">{'curl -s https://evm.ynxweb4.com -H \'content-type: application/json\' -d \'{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}\' | jq'}</code>
                    <button onClick={() => navigator.clipboard.writeText("curl -s https://evm.ynxweb4.com -H 'content-type: application/json' -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_chainId\",\"params\":[]}' | jq")} className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 bg-white/10 rounded hover:bg-white/20 transition-all"><Copy size={12} /></button>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed group relative">
                    <code className="text-emerald-400">curl -s https://faucet.ynxweb4.com/health | jq</code>
                    <button onClick={() => navigator.clipboard.writeText("curl -s https://faucet.ynxweb4.com/health | jq")} className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 bg-white/10 rounded hover:bg-white/20 transition-all"><Copy size={12} /></button>
                  </div>
                </div>
                <p className="text-[10px] text-white/30 italic">
                  * Testnet tokens (anyxt) have no mainnet value.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-klein to-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#0d1117] rounded-xl border border-white/10 p-6 font-mono text-sm overflow-x-auto shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="text-emerald-400">
{`// hardhat.config.ts
export default {
  networks: {
    ynx_testnet: {
      url: "https://evm.ynxweb4.com",
      chainId: 9102,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
