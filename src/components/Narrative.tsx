import { motion } from "motion/react";

export function Narrative() {
  const steps = [
    { year: "Web1", action: "Read", desc: "You mainly 'browse web pages'." },
    { year: "Web2", action: "Interact", desc: "You start 'interacting within platforms', like social media, food delivery, and cloud services." },
    { year: "Web3", action: "Own", desc: "Putting assets, rules, and transaction records into a public ledger, so platforms are no longer the sole referee." },
    {
      year: "Web4",
      action: "Act",
      desc: "Not just 'humans clicking buttons', but 'humans authorizing AI to act on their behalf'.",
      active: true,
    },
  ];

  return (
    <section
      id="narrative"
      className="py-32 bg-ink text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,47,167,0.15),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight leading-[1.1]">
              The internet learned to read.
              <br />
              <span className="text-white/60">Then it learned to interact.</span>
              <br />
              <span className="text-white/40">Then it learned to own.</span>
              <br />
              <span className="font-bold text-klein">
                Now it is learning to act.
              </span>
            </h2>
            <p className="mt-8 text-lg text-white/60 max-w-xl font-light leading-relaxed">
              YNX is the execution layer for that next step. Think of YNX as a "Global Public Ledger + Automated Execution System" not controlled by a single platform.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative pl-16"
                >
                  <div
                    className={`absolute left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${
                      step.active
                        ? "bg-klein border-klein shadow-[0_0_15px_rgba(0,47,167,0.8)]"
                        : "bg-ink border-white/20"
                    }`}
                  />

                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-mono tracking-widest uppercase ${
                        step.active ? "text-klein" : "text-white/40"
                      }`}
                    >
                      {step.year}
                    </span>
                    <h3
                      className={`text-3xl font-display mt-1 ${
                        step.active
                          ? "font-bold text-white"
                          : "font-light text-white/60"
                      }`}
                    >
                      {step.action}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        step.active ? "text-white/80" : "text-white/40"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
