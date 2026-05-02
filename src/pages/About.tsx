import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export function About() {
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
              Mission
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink mb-6">
              The Future of <br />
              <span className="text-klein">Coordination</span>
            </h1>
            <p className="text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed mb-10">
              YNX is the AI-native sovereign execution layer. We provide the infrastructure for autonomous coordination between humans and AI agents.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-lg prose-ink mx-auto"
        >
          <h2 className="text-3xl font-display font-bold mb-6">Why YNX?</h2>
          <p className="text-lg text-ink/70 leading-relaxed mb-6">
            The internet began as a library (Web1), evolved into a platform (Web2), and transformed into a property rights system (Web3). The next step is agency.
          </p>
          <p className="text-lg text-ink/70 leading-relaxed mb-6">
            Web4 is the era of autonomous action. It is where software doesn't just display information or transfer value, but actively performs work, negotiates services, and executes complex workflows without constant human supervision.
          </p>
          <p className="text-lg text-ink/70 leading-relaxed mb-6">
            Current blockchains are designed for human-speed interaction. They lack the primitives for high-frequency, policy-bounded machine coordination. YNX fills this gap.
          </p>

          <h2 className="text-3xl font-display font-bold mb-6 mt-16">Our Thesis</h2>
          <ul className="list-disc pl-6 space-y-4 text-ink/70 marker:text-klein mb-16">
            <li><strong>Sovereignty First:</strong> AI agents must be owned and controlled by humans or DAOs, not centralized platforms.</li>
            <li><strong>Policy Over Permission:</strong> Execution should be bounded by code-enforced policies, not manual approval for every action.</li>
            <li><strong>Machine-Native Economy:</strong> Payments between agents should be streaming, micro-transactional, and friction-free.</li>
          </ul>

          <h2 className="text-3xl font-display font-bold mb-6 mt-16">Founder</h2>
          <div className="flex items-center gap-6 mb-16">
            <div className="w-16 h-16 rounded-full bg-klein/10 flex items-center justify-center text-klein font-display font-bold text-xl">
              HJ
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink">HuangJiahao</h3>
              <p className="text-ink/60">Founder</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-ink text-white p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,47,167,0.4),transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-6">Join the Revolution</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              The public testnet is live. Whether you are a developer, validator, or researcher, there is a place for you in the YNX ecosystem.
            </p>
            <Button variant="klein" size="lg" asChild>
              <Link to="/docs/en/public-testnet-join">
                Start Contributing
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
