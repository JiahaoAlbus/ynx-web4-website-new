import { motion } from "motion/react";
import { Shield, Key, Cpu, Activity, Zap, Layers } from "lucide-react";

export function Web4() {
  const features = [
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Transfer & Settlement",
      desc: "Transfer assets on-chain with searchable records and a fully verifiable process.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Run Applications",
      desc: "Developers can deploy smart contracts and applications directly on YNX for users to interact with.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Machine Payments",
      desc: "In the future, not only humans will pay, but AI can also automatically pay and call services according to rules.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "On-chain Governance",
      desc: "Rules are not changed in a black box. Key changes go through a transparent, public governance process.",
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Open Access",
      desc: "Developers, validators, and ecosystem partners can all join. YNX is an open execution network, not a closed system.",
    },
  ];

  return (
    <section id="web4" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
            User Perspective
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
            What can YNX do?
          </h2>
          <p className="mt-6 text-lg text-ink/60 leading-relaxed">
            From "trusting the platform" to "verifying the rules". In Web2, platforms control your data and rules. In YNX's Web4 paradigm, assets and records are on-chain, authorization is signed by your wallet, and execution is fully traceable.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-border bg-surface/50 hover:bg-surface transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-klein/10 text-klein flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-semibold text-ink mb-3">
                {feature.title}
              </h3>
              <p className="text-ink/70 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
