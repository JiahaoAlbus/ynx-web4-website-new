import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export function Background() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], ["0px", "120px"]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,47,167,0.03),transparent_70%)]" />
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-klein/5 rounded-full blur-[120px] mix-blend-multiply"
        animate={reduceMotion ? undefined : { x: [0, -24, 0], y: [0, 18, 0], opacity: [0.45, 0.72, 0.45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-klein-dark/5 rounded-full blur-[100px] mix-blend-multiply"
        animate={reduceMotion ? undefined : { x: [0, 20, 0], y: [0, -18, 0], opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      
      {/* Grid Overlay */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"
        style={{ y: gridY, maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)' }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(0,47,167,0.08),transparent)]"
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)' }}
      />
    </div>
  );
}
