import { motion, useReducedMotion } from "motion/react";

const rails = [
  "M0 24 C140 10 225 42 360 26 S610 14 760 40 S1010 60 1220 22",
  "M0 92 C180 122 240 58 420 88 S690 118 850 86 S1050 48 1220 84",
  "M0 154 C190 124 320 178 500 148 S720 112 940 154 S1120 190 1220 150",
];

const packets = [
  { path: rails[0], delay: 0, color: "#002fa7" },
  { path: rails[1], delay: 1.2, color: "#10b981" },
  { path: rails[2], delay: 2.1, color: "#002fa7" },
];

export function KineticGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-20 z-0 h-[32rem] overflow-hidden opacity-80 [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_70%,transparent)]">
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,47,167,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,47,167,0.045)_1px,transparent_1px)] bg-[size:64px_64px]"
        animate={reduceMotion ? undefined : { opacity: [0.72, 0.92, 0.72] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 1220 220" className="absolute inset-x-0 top-20 h-56 w-full">
        <defs>
          <linearGradient id="kinetic-rail" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(0,47,167,0)" />
            <stop offset="45%" stopColor="rgba(0,47,167,0.22)" />
            <stop offset="78%" stopColor="rgba(16,185,129,0.16)" />
            <stop offset="100%" stopColor="rgba(0,47,167,0)" />
          </linearGradient>
        </defs>
        {rails.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="url(#kinetic-rail)"
            strokeWidth="1.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: index * 0.14, duration: 1.1, ease: [0.05, 0.7, 0.1, 1] }}
          />
        ))}
        {!reduceMotion &&
          packets.map((packet) => (
            <motion.circle
              key={packet.delay}
              r="3.5"
              fill={packet.color}
              animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 7.2, delay: packet.delay, repeat: Infinity, ease: "easeInOut" }}
              style={{ offsetPath: `path('${packet.path}')` }}
            />
          ))}
      </svg>
    </div>
  );
}
