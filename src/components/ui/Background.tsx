import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export function Background() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], ["0px", "100px"]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,47,167,0.05),transparent_38%),radial-gradient(circle_at_15%_35%,rgba(0,47,167,0.022),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#ffffff_46%,#ffffff_100%)]" />
      <motion.div
        className="absolute right-[-10%] top-[-18%] h-[620px] w-[620px] rounded-full bg-klein/6 blur-[120px] mix-blend-multiply"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -18, 0], y: [0, 16, 0], opacity: [0.45, 0.72, 0.45] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-18%] left-[-10%] h-[520px] w-[520px] rounded-full bg-klein-dark/5 blur-[110px] mix-blend-multiply"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 18, 0], y: [0, -12, 0], opacity: [0.35, 0.6, 0.35] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,47,167,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,15,28,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
        style={{
          y: gridY,
          maskImage: "radial-gradient(ellipse 78% 76% at 50% 42%, #000 58%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(to_bottom,rgba(0,47,167,0.12),transparent)]"
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)" }}
      />
      <motion.div
        className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-klein/15 to-transparent"
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.55, 0.2], scaleX: [0.8, 1, 0.82] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
