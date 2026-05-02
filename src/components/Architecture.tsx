import { motion } from "motion/react";
import {
  ArrowRight,
  Box,
  Cpu,
  Database,
  Globe,
  Key,
  Link,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { motionEase, revealSoft, stagger } from "../lib/motion";

export function Architecture() {
  const nodes = [
    {
      id: "owner",
      label: "Owner",
      icon: <User className="w-5 h-5" />,
      desc: "Human or DAO",
    },
    {
      id: "policy",
      label: "Policy",
      icon: <Shield className="w-5 h-5" />,
      desc: "Execution Rules",
    },
    {
      id: "session",
      label: "Session Key",
      icon: <Key className="w-5 h-5" />,
      desc: "Scoped Access",
    },
    {
      id: "agent",
      label: "AI Agent",
      icon: <Cpu className="w-5 h-5" />,
      desc: "Autonomous Actor",
    },
    {
      id: "gateway",
      label: "AI Gateway",
      icon: <Globe className="w-5 h-5" />,
      desc: "Service Interface",
    },
    {
      id: "hub",
      label: "Web4 Hub",
      icon: <Link className="w-5 h-5" />,
      desc: "Coordination Layer",
    },
    {
      id: "chain",
      label: "YNX Chain",
      icon: <Box className="w-5 h-5" />,
      desc: "Execution Layer",
    },
    {
      id: "vault",
      label: "Vault / Payments",
      icon: <Wallet className="w-5 h-5" />,
      desc: "Machine Value",
    },
    {
      id: "explorer",
      label: "Explorer / Indexer",
      icon: <Database className="w-5 h-5" />,
      desc: "Auditable State",
    },
    {
      id: "validators",
      label: "Validators",
      icon: <Shield className="w-5 h-5" />,
      desc: "Network Security",
    },
  ];

  return (
    <section
      id="architecture"
      className="py-32 bg-ink text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,47,167,0.15),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
            Core Architecture
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            The Sovereignty Model
          </h2>
          <p className="mt-6 text-lg text-white/60 leading-relaxed font-mono">
            owner {">"} policy {">"} session key
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Abstract Connection Lines */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <svg className="w-full h-full" style={{ minHeight: "400px" }}>
              <motion.path
                d="M 100,50 C 200,50 300,150 400,150"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: motionEase.standard }}
              />
              <motion.path
                d="M 400,150 C 500,150 600,50 700,50"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.14, duration: 0.7, ease: motionEase.standard }}
              />
              <motion.path
                d="M 100,250 C 200,250 300,150 400,150"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.28, duration: 0.7, ease: motionEase.standard }}
              />
              <motion.path
                d="M 400,150 C 500,150 600,250 700,250"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.42, duration: 0.7, ease: motionEase.standard }}
              />
            </svg>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 gap-y-12 relative z-10"
          >
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                variants={revealSoft}
                className="flex flex-col items-center text-center group"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-klein/20 group-hover:border-klein/50 transition-all duration-300 relative"
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                >
                  {node.icon}
                  {/* Glowing dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-klein rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(0,47,167,0.8)]" />
                </motion.div>
                <h4 className="text-sm font-display font-semibold text-white mb-1">
                  {node.label}
                </h4>
                <p className="text-xs text-white/40 font-mono">{node.desc}</p>

                {/* Mobile/Tablet Arrow */}
                {index < nodes.length - 1 && (
                  <div className="lg:hidden mt-6 text-white/20">
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
