import { motion } from "motion/react";
import { FAQ } from "../components/FAQ";

export function FAQPage() {
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
              Support
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink mb-6">
              Frequently Asked <br />
              <span className="text-klein">Questions</span>
            </h1>
            <p className="text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed mb-10">
              Everything you need to know about the YNX testnet, Web4 architecture, and validator requirements.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6">
        <FAQ />
      </section>
    </div>
  );
}
