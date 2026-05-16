import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, ExternalLink, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { NETWORK } from "../constants/network";
import { useValidatorReadiness } from "../hooks/useValidatorReadiness";

export function TestnetLive() {
  const endpoints = [
    { label: "RPC", url: NETWORK.endpoints.rpc },
    { label: "EVM RPC", url: NETWORK.endpoints.evm },
    { label: "REST", url: NETWORK.endpoints.rest },
    { label: "Faucet", url: NETWORK.endpoints.faucet },
    { label: "Indexer", url: NETWORK.endpoints.indexer },
    { label: "Explorer", url: NETWORK.endpoints.explorer },
    { label: "AI Gateway", url: NETWORK.endpoints.ai },
    { label: "Web4 Hub", url: NETWORK.endpoints.web4 },
  ];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { snapshot, loading } = useValidatorReadiness();

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="testnet" className="py-32 bg-surface relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border mb-6">
            <span className="w-2 h-2 rounded-full bg-klein animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wide text-ink/70 uppercase">
              v2-web4 Track Active
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
            Public Testnet Live
          </h2>
          <p className="mt-6 text-lg text-ink/60 leading-relaxed">
            The network is operational. Connect your tools, deploy your agents,
            and start building the execution layer for Web4.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Network Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-ink text-white p-8 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-display font-semibold mb-6">
                Network Details
              </h3>
              <div className="space-y-6">
                <div>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">
                    Chain ID
                  </span>
                  <span className="text-xl font-mono">ynx_9102-1</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">
                    Native Asset
                  </span>
                  <span className="text-xl font-mono">NYXT</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">
                    Denom
                  </span>
                  <span className="text-xl font-mono">anyxt</span>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <Button
                variant="klein"
                className="w-full justify-between group"
                asChild
              >
                <a
                  href="https://explorer.ynxweb4.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Explorer
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between group bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link to="/docs/en/public-testnet-join">
                  Read Documentation
                  <Terminal className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 text-[11px] leading-relaxed text-white/50 space-y-2 font-mono">
              <p>
                •{" "}
                {snapshot
                  ? `Current public testnet has ${snapshot.bonded_count} bonded validators (${snapshot.unjailed_count} unjailed).`
                  : loading
                    ? "Checking bonded validator set..."
                    : "Validator data unavailable. Please verify via REST/indexer."}
              </p>
              <p>• Testnet tokens have no mainnet value. Mainnet is not live yet.</p>
              <p>• Remaining external work before mainnet: independent external validators, additional public RPC/sentry outside current provider/account, real alerting/on-call, restore drill, external security review.</p>
            </div>
          </motion.div>

          {/* Endpoints Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 grid sm:grid-cols-2 gap-4"
          >
            {endpoints.map((endpoint, index) => (
              <div
                key={endpoint.label}
                className="bg-white p-6 rounded-2xl border border-border flex flex-col justify-between group hover:border-klein/30 transition-colors"
              >
                <span className="text-xs font-mono text-ink/50 uppercase tracking-widest mb-3 block">
                  {endpoint.label}
                </span>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm font-mono text-ink truncate flex-1">
                    {endpoint.url}
                  </code>
                  <button
                    onClick={() => handleCopy(endpoint.url, index)}
                    className="p-2 rounded-md hover:bg-surface text-ink/40 hover:text-klein transition-colors shrink-0"
                    aria-label={`Copy ${endpoint.label} URL`}
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
