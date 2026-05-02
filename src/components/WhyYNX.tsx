import { motion } from "motion/react";

export function WhyYNX() {
  const reasons = [
    {
      title: "Clear Positioning: Sovereign Execution Layer",
      desc: "It's not just about 'speed', but about 'how rules are reliably executed'.",
    },
    {
      title: "Built for the AI Era",
      desc: "Supports 'humans + AI' jointly using the network and value system.",
    },
    {
      title: "Developer Friendly",
      desc: "Public interfaces, documentation, explorers, and testnet facilities are all fully equipped.",
    },
    {
      title: "Verifiable & Auditable",
      desc: "Key actions are traceable, not a black box.",
    },
    {
      title: "Steady Path from Testnet to Mainnet",
      desc: "First stabilize the system, then scale the ecosystem.",
    },
  ];

  return (
    <section id="why" className="py-32 bg-surface relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
            The Execution Gap
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
            Why YNX Exists
          </h2>
          <p className="mt-6 text-lg text-ink/60 leading-relaxed">
            Existing infrastructure was built for human coordination. YNX is
            built for machine coordination.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center mb-6 group-hover:bg-klein/10 transition-colors">
                <span className="text-ink font-mono font-medium group-hover:text-klein transition-colors">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-2xl font-display font-semibold text-ink mb-4">
                {reason.title}
              </h3>
              <p className="text-ink/70 leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
