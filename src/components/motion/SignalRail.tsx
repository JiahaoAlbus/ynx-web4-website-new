import { motion, useReducedMotion } from "motion/react";

type SignalRailProps = {
  className?: string;
  density?: "calm" | "active";
};

const rails = [
  "M-80 84 C 180 12, 390 170, 690 88 S 1090 64, 1420 132",
  "M-60 190 C 220 260, 430 80, 710 170 S 1080 310, 1390 160",
  "M-100 308 C 170 248, 420 330, 660 270 S 1010 198, 1380 290",
];

export function SignalRail({ className = "", density = "calm" }: SignalRailProps) {
  const reduceMotion = useReducedMotion();
  const packetCount = density === "active" ? 9 : 5;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,47,167,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,47,167,0.05)_1px,transparent_1px)] bg-[size:72px_72px]"
        animate={reduceMotion ? undefined : { backgroundPosition: ["0px 0px", "72px 36px"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      <svg className="absolute inset-x-0 top-8 h-[360px] w-full" viewBox="0 0 1320 360" preserveAspectRatio="none">
        <defs>
          <linearGradient id="signal-rail-gradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#002FA7" stopOpacity="0" />
            <stop offset="48%" stopColor="#002FA7" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {rails.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="url(#signal-rail-gradient)"
            strokeWidth={index === 1 ? 1.15 : 0.75}
            strokeDasharray={index === 1 ? "10 18" : "4 18"}
            animate={reduceMotion ? undefined : { strokeDashoffset: [0, index === 1 ? -90 : 70] }}
            transition={{ duration: 10 + index * 3, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {!reduceMotion &&
          Array.from({ length: packetCount }).map((_, index) => {
            const path = rails[index % rails.length];
            const delay = index * 0.52;
            return (
              <motion.circle
                key={index}
                r={index % 3 === 0 ? 4 : 3}
                fill={index % 2 === 0 ? "#002FA7" : "#10B981"}
                opacity="0.72"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: ["0%", "100%"] }}
                transition={{ duration: 7.5 + (index % 3), delay, repeat: Infinity, ease: "easeInOut" }}
                style={{ offsetPath: `path("${path}")` }}
              />
            );
          })}
      </svg>
      <motion.div
        className="absolute right-[8%] top-20 h-64 w-64 rounded-full bg-klein/10 blur-[80px]"
        animate={reduceMotion ? undefined : { opacity: [0.24, 0.56, 0.24], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
