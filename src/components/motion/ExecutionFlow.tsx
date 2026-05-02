import { motion, useReducedMotion } from "motion/react";
import { Cpu, KeyRound, ShieldCheck, WalletCards } from "lucide-react";
import { motionEase } from "../../lib/motion";

const nodes = [
  { label: "Owner", icon: ShieldCheck, x: 18, y: 34 },
  { label: "Policy", icon: KeyRound, x: 42, y: 20 },
  { label: "Agent", icon: Cpu, x: 64, y: 46 },
  { label: "Vault", icon: WalletCards, x: 84, y: 30 },
];

export function ExecutionFlow({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`pointer-events-none absolute right-6 top-56 hidden h-[26rem] w-[34rem] max-w-[38vw] 2xl:block ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-[48px] border border-klein/10 bg-white/20 [mask-image:linear-gradient(to_left,#000,transparent)]"
        animate={reduceMotion ? undefined : { opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ynx-flow-line" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(0,47,167,0)" />
            <stop offset="50%" stopColor="rgba(0,47,167,0.58)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.45)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M18 34 C28 8 36 9 42 20 S55 52 64 46 S76 18 84 30"
          fill="none"
          stroke="url(#ynx-flow-line)"
          strokeWidth="0.7"
          strokeDasharray="2 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: motionEase.emphasized }}
        />
        {!reduceMotion && (
          <motion.circle
            r="1.2"
            fill="#002fa7"
            filter="drop-shadow(0 0 8px rgba(0,47,167,0.8))"
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              offsetPath: "path('M18 34 C28 8 36 9 42 20 S55 52 64 46 S76 18 84 30')",
            }}
          />
        )}
      </svg>

      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18 + index * 0.12, duration: 0.45, ease: motionEase.emphasized }}
          >
            <motion.div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-klein/15 bg-white/80 text-klein shadow-xl shadow-klein/10 backdrop-blur-xl"
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 5 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-white bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.75)]" />
            </motion.div>
            <span className="rounded-full border border-border/60 bg-white/70 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-ink/50 backdrop-blur">
              {node.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
