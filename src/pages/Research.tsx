import { motion } from "motion/react";
import { Shield, Key, Cpu, Activity, Zap, Layers, Lock, Globe } from "lucide-react";
import { TiltCard } from "../components/ui/TiltCard";

export function Research() {
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
              Web4 Paradigm
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink mb-6">
              The Sovereignty <br />
              <span className="text-klein">Model</span>
            </h1>
            <p className="text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed mb-10">
              Web4 is not "Web3 with a chatbot." It is a sovereign execution layer where AI agents are first-class, verifiable participants in the economy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 mb-32 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-display font-bold mb-6">Owner &gt; Policy &gt; Session Key</h2>
          <p className="text-lg text-ink/70 leading-relaxed mb-6">
            In the Web4 paradigm, autonomy requires bounded authority. While Web3 focuses on human ownership, Web4 focuses on machine-native delegation.
          </p>
          <p className="text-lg text-ink/70 leading-relaxed">
            The YNX Web4 stack allows humans to define <strong>Policies</strong> (what is allowed) and issue <strong>Sessions</strong> (the temporary key to do it). The agent executes, but the protocol enforces the boundary.
          </p>
        </motion.div>
        
        <TiltCard className="h-full">
          <div className="bg-ink p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,47,167,0.2),transparent_50%)]" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4 group cursor-default">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white transition-colors group-hover:bg-white/20"
                >
                  <Shield className="w-6 h-6" />
                </motion.div>
                <div>
                  <h4 className="text-white font-bold text-lg group-hover:text-klein-light transition-colors">Owner (Human/DAO)</h4>
                  <p className="text-white/40 text-sm">Ultimate authority, sets policy.</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 ml-6" />
              <div className="flex items-center gap-4 group cursor-default">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-klein/20 flex items-center justify-center text-klein border border-klein/50 transition-colors group-hover:bg-klein/30 group-hover:border-klein"
                >
                  <Lock className="w-6 h-6" />
                </motion.div>
                <div>
                  <h4 className="text-white font-bold text-lg group-hover:text-klein-light transition-colors">Policy Layer</h4>
                  <p className="text-white/40 text-sm">Defines limits (gas, contract, time).</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 ml-6" />
              <div className="flex items-center gap-4 group cursor-default">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/50 transition-colors group-hover:bg-emerald-500/30 group-hover:border-emerald-500"
                >
                  <Key className="w-6 h-6" />
                </motion.div>
                <div>
                  <h4 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">Session Key (Agent)</h4>
                  <p className="text-white/40 text-sm">Scoped execution authority.</p>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-32">
        {[
          {
            icon: <Globe className="w-8 h-8" />,
            title: "Wallet as Identity",
            desc: "Agents are first-class citizens. Their wallet address is their verifiable identity, accumulating reputation and history.",
          },
          {
            icon: <Zap className="w-8 h-8" />,
            title: "Machine Payments",
            desc: "Frictionless value transfer optimized for machine-to-machine service economies.",
          },
          {
            icon: <Activity className="w-8 h-8" />,
            title: "Auditable Actions",
            desc: "Every autonomous decision is recorded on-chain, providing a transparent audit trail for AI behavior.",
          },
        ].map((feature, i) => (
          <TiltCard key={i} className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-surface border border-border rounded-2xl h-full hover:border-klein/30 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-klein mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-ink/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          </TiltCard>
        ))}
      </section>
    </div>
  );
}
