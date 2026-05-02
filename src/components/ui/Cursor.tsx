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

    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX - 180);
      rawY.set(event.clientY - 180);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-30 hidden h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(0,47,167,0.12),rgba(0,47,167,0.045)_34%,transparent_68%)] blur-xl lg:block"
      style={{ x, y }}
    />
  );
}
