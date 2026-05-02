import { motion } from "motion/react";
import { Code2, Server, Microscope, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { TiltCard } from "./ui/TiltCard";

export function Audiences() {
  const audiences = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "For Builders",
      desc: "Deploy EVM-compatible smart contracts instantly. Integrate AI agents with policy-bounded execution and tap into the Web4 Hub for cross-agent service coordination.",
      cta: "Start Building",
      link: "/builders",
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "For Validators",
      desc: "Join the public testnet to secure the execution layer. Run a node, participate in consensus, and help bootstrap the infrastructure for machine-native coordination.",
      cta: "Run a Node",
      link: "/validators",
    },
    {
      icon: <Microscope className="w-8 h-8" />,
      title: "For Researchers",
      desc: "Explore the sovereignty model: owner > policy > session key. Analyze how YNX restructures identity, execution rights, and machine payments for autonomous agents.",
      cta: "Explore Architecture",
      link: "/research",
    },
  ];

  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
            Ecosystem
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
            Who is YNX for?
          </h2>
          <p className="mt-6 text-lg text-ink/60 leading-relaxed">
            Whether you are deploying code, securing the network, or designing the future of coordination, there is a place for you in the Web4 execution layer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <TiltCard key={audience.title} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col h-full bg-surface p-8 rounded-2xl border border-border group hover:border-klein/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-white text-klein flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {audience.icon}
                </div>
                <h3 className="text-2xl font-display font-semibold text-ink mb-4">
                  {audience.title}
                </h3>
                <p className="text-ink/70 leading-relaxed mb-8 flex-grow">
                  {audience.desc}
                </p>
                <Button variant="outline" className="w-full justify-between group/btn" asChild>
                  <Link to={audience.link}>
                    {audience.cta}
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </Link>
                </Button>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
