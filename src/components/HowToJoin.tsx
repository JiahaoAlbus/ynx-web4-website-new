import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function HowToJoin() {
  const steps = [
    {
      title: "Explore the network",
      desc: "Connect to the RPC, view the explorer, and request testnet tokens from the faucet.",
    },
    {
      title: "Read the docs",
      desc: "Understand the EVM-first surface, AI Gateway, and Web4 Hub architecture.",
    },
    {
      title: "Run a node",
      desc: "Follow the operator-ready bootstrap guide to sync a full node on the v2-web4 track.",
    },
    {
      title: "Join the public testnet",
      desc: "Submit your validator transaction and begin participating in network consensus.",
    },
    {
      title: "Contribute feedback",
      desc: "Help refine the sovereignty model and machine-native coordination primitives.",
    },
  ];

  return (
    <section id="join" className="py-32 bg-surface relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
            Onboarding
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
            How to Join the Testnet
          </h2>
          <p className="mt-6 text-lg text-ink/60 leading-relaxed">
            The v2-web4 public testnet is open. Follow these steps to become a
            validator or deploy your first agent.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-12 items-start group"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-border shrink-0 z-10 group-hover:border-klein group-hover:text-klein transition-colors shadow-sm">
                  <span className="font-mono font-medium text-lg">
                    0{index + 1}
                  </span>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-border shadow-sm flex-1 group-hover:border-klein/30 transition-colors">
                  <h3 className="text-2xl font-display font-semibold text-ink mb-3">
                    {step.title}
                  </h3>
                  <p className="text-ink/70 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <Button variant="klein" size="lg" className="group" asChild>
              <Link to="/docs/en/public-testnet-join">
                View Full Guide
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
