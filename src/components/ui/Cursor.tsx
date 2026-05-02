import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export function Cursor() {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);
  const x = useSpring(rawX, { stiffness: 70, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 70, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        rawX.set(event.clientX - 140);
        rawY.set(event.clientY - 140);
        raf = 0;
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [rawX, rawY, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-30 hidden h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(0,47,167,0.10),rgba(0,47,167,0.035)_34%,transparent_68%)] blur-lg will-change-transform lg:block"
      style={{ x, y }}
    />
  );
}
