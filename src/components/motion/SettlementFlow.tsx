import { motion, useReducedMotion } from "motion/react";
import { Check, KeyRound, ShieldCheck, WalletCards, Zap } from "lucide-react";
import { motionEase } from "../../lib/motion";

const stages = [
  { label: "Policy", icon: ShieldCheck },
  { label: "Session", icon: KeyRound },
  { label: "Vault", icon: WalletCards },
  { label: "Job", icon: Zap },
  { label: "Settle", icon: Check },
];

export function SettlementFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,47,167,0.28),transparent_42%)]" />
      <div className="relative flex items-center justify-between gap-3">
        <motion.div
          className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2 bg-white/10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: motionEase.emphasized }}
          style={{ transformOrigin: "left" }}
        />
        {!reduceMotion && (
          <motion.div
            className="absolute top-1/2 z-10 h-2 w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-klein to-emerald-400 blur-[1px]"
            animate={{ left: ["2rem", "calc(100% - 6rem)"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.label}
              className="relative z-20 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.36, ease: motionEase.emphasized }}
            >
              <motion.div
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/50 text-klein shadow-lg shadow-klein/10 backdrop-blur"
                animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 3.6 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
