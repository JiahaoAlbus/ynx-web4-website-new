import { motion } from "motion/react";
import { Server, Shield, Activity, ArrowRight, Copy } from "lucide-react";
import { Button } from "../components/ui/button";
import { TiltCard } from "../components/ui/TiltCard";
import { Magnetic } from "../components/ui/Magnetic";
import { Link } from "react-router-dom";
import { SignalRail } from "../components/motion/SignalRail";
import { motionEase, revealSoft, stagger } from "../lib/motion";

export function Validators() {
  return (
    <div className="pt-40 pb-32">
      <section className="relative py-20 px-6 overflow-hidden">
        <SignalRail density="active" className="opacity-70" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
              For Validators
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink mb-6">
              Secure the <br />
              <span className="text-klein">Web4 Network</span>
            </h1>
            <p className="text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed mb-10">
              The YNX consensus layer is powered by a set of bonded validators. We are currently seeking external node operators to join the public testnet mesh and stress-test the AI-native execution logic.
            </p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.24 } } }}
              className="flex justify-center gap-4"
            >
              <Magnetic>
                <motion.div variants={revealSoft}>
                <Button variant="klein" size="lg" asChild>
                  <Link to="/docs/en/public-testnet-join">
                    Join Testnet
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                </motion.div>
              </Magnetic>
              <Magnetic>
                <motion.div variants={revealSoft}>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://explorer.ynxweb4.com" target="_blank" rel="noreferrer">
                    <Activity className="mr-2 w-4 h-4" />
                    Explorer
                  </a>
                </Button>
                </motion.div>
              </Magnetic>
              <Magnetic>
                <motion.div variants={revealSoft}>
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/docs/en/public-testnet-join">
                    <Server className="mr-2 w-4 h-4" />
                    Operator Guide
                  </Link>
                </Button>
                </motion.div>
              </Magnetic>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-32"
      >
        {[
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Network Security",
            desc: "Validators secure the chain through Proof-of-Stake consensus, ensuring finality and integrity for all Web4 transactions.",
          },
          {
            icon: <Activity className="w-8 h-8" />,
            title: "Consensus Participation",
            desc: "Propose and validate blocks, earning rewards in NYXT for maintaining network uptime and performance.",
          },
          {
            icon: <Server className="w-8 h-8" />,
            title: "Infrastructure Backbone",
            desc: "Run full nodes to support RPC endpoints, indexing services, and the AI Gateway for the broader ecosystem.",
          },
        ].map((feature, i) => (
          <TiltCard key={i} className="h-full">
            <motion.div
              variants={revealSoft}
              whileHover={{ y: -8, scale: 1.012 }}
              transition={{ duration: 0.2, ease: motionEase.standard }}
              className="p-8 bg-surface border border-border rounded-2xl h-full hover:border-klein/30 transition-colors relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-klein to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
              />
              <motion.div
                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-klein mb-6 shadow-sm"
                whileHover={{ rotate: -3, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 360, damping: 22 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-ink/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          </TiltCard>
        ))}
      </motion.section>

      <section className="bg-surface py-24 relative overflow-hidden rounded-3xl mx-6 shadow-sm border border-border/50">
        <motion.div
          className="absolute left-[calc(50%-2px)] top-44 hidden h-[62%] w-px bg-gradient-to-b from-klein/0 via-klein/25 to-klein/0 md:block"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.1, ease: motionEase.emphasized }}
          style={{ originY: 0 }}
        />
        <motion.div
          className="absolute left-[calc(50%-4px)] top-44 hidden h-2 w-2 rounded-full bg-klein shadow-[0_0_24px_rgba(0,47,167,0.5)] md:block"
          animate={{ y: [0, 420, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-display font-bold text-center mb-16">Onboarding Steps</h2>
          
          <div className="space-y-12">
            {[
              { 
                title: "Install YNX CLI", 
                desc: "Install the canonical binary for interacting with the Web4 track.",
                code: "curl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash\nexport PATH=\"$HOME/.local/bin:$PATH\""
              },
              { 
                title: "Join as Validator Candidate", 
                desc: "Initialize your server and start the state-sync process. Our join flow defaults to state-sync for instant compatibility.",
                code: "ynx join --role validator"
              },
              { 
                title: "Fund Validator Account", 
                desc: "Use the faucet or operator-provided testnet funding to cover fees and initial bond.",
                link: "https://faucet.ynxweb4.com"
              },
              { 
                title: "Submit Create-Validator", 
                desc: "Prepare your create-validator.json and submit the transaction to the network.",
                link: "https://github.com/JiahaoAlbus/YNX/blob/main/docs/en/V2_CONSENSUS_VALIDATOR_JOIN_GUIDE.md"
              },
              { 
                title: "Preflight & Monitoring", 
                desc: "Run the candidate check before bonding and use the launch-grade monitor for uptime tracking.",
                code: "# Run candidate check\n./scripts/validator_candidate_check.sh\n\n# Start monitoring\n./scripts/testnet_launch_grade_monitor.sh"
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-8 group"
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-klein text-white flex items-center justify-center font-display font-bold text-xl shrink-0 shadow-lg shadow-klein/20"
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 360, damping: 20 }}
                >
                  {i + 1}
                </motion.div>
                <motion.div
                  whileHover={{ x: 8, y: -2 }}
                  transition={{ duration: 0.18, ease: motionEase.standard }}
                  className="flex-1 bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all group"
                >
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-ink/60 mb-6 leading-relaxed">{step.desc}</p>
                  
                  {step.code && (
                    <div className="relative">
                      <pre className="p-4 bg-ink text-emerald-400 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre relative">
                        <code>{step.code}</code>
                      </pre>
                      <button 
                        onClick={() => navigator.clipboard.writeText(step.code || "")}
                        className="absolute top-3 right-3 p-2 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 text-white"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  )}

                  {step.link && (
                    <a 
                      href={step.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 text-klein font-bold hover:underline"
                    >
                      Canonical Guide <ArrowRight size={16} />
                    </a>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-8 bg-ink text-white rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-klein/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Shield className="text-klein" />
              Network Status: Public Testnet v2
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div className="space-y-2">
                <span className="text-white/40 uppercase font-mono tracking-widest text-[10px]">Active Validators</span>
                <p className="text-2xl font-bold text-white">4 / 100</p>
                <p className="text-white/40 text-[10px]">Unjailed & Bonded</p>
              </div>
              <div className="space-y-2">
                <span className="text-white/40 uppercase font-mono tracking-widest text-[10px]">Avg Block Time</span>
                <p className="text-2xl font-bold text-white">1.05s</p>
                <p className="text-white/40 text-[10px]">Deterministic Finality</p>
              </div>
              <div className="space-y-2">
                <span className="text-white/40 uppercase font-mono tracking-widest text-[10px]">Infrastructure</span>
                <p className="text-2xl font-bold text-white">Hybrid Cloud</p>
                <p className="text-white/40 text-[10px]">Resilient Mesh</p>
              </div>
            </div>
            <p className="mt-8 text-xs text-white/40 italic">
              External validators are critical for the decentralization of the sovereign execution layer. We invite institutional and individual operators to sync and bond.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
