import { motion } from "motion/react";
import {
  CheckCircle2,
  Activity,
  GitCommit,
  Terminal,
  Globe,
  Cpu,
  Link,
} from "lucide-react";
import { revealSoft, stagger } from "../lib/motion";

export function ProofOfReadiness() {
  const statuses = [
    {
      label: "Public Endpoints",
      status: "Live",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      label: "Explorer & Indexer",
      status: "Live",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: "EVM RPC",
      status: "Live",
      icon: <Terminal className="w-5 h-5" />,
    },
    { label: "AI Gateway", status: "Live", icon: <Cpu className="w-5 h-5" /> },
    { label: "Web4 Hub", status: "Live", icon: <Link className="w-5 h-5" /> },
    {
      label: "GitHub Repository",
      status: "Active",
      icon: <GitCommit className="w-5 h-5" />,
    },
    {
      label: "Operator Tooling",
      status: "Ready",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-32 bg-white relative border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
              Proof of Readiness
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
              It is already real.
            </h2>
            <p className="mt-6 text-lg text-ink/60 leading-relaxed">
              YNX is not a whitepaper project. The infrastructure is deployed,
              the endpoints are live, and the network is actively processing
              Web4 execution flows.
            </p>

            <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface border border-border">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-mono font-medium text-ink">
                Network Status: Operational
              </span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, staggerChildren: 0.07 },
              },
            }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {statuses.map((item, index) => (
              <motion.div
                key={item.label}
                variants={revealSoft}
                whileHover={{ y: -3, scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-colors relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 w-1 bg-emerald-500"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.28 }}
                  style={{ transformOrigin: "bottom" }}
                />
                <div className="flex items-center gap-3 text-ink/80">
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-semibold bg-emerald-100 px-2 py-1 rounded-md">
                  {item.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
