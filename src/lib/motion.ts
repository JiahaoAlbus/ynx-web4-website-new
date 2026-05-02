export const motionEase = {
  standard: [0.25, 0.1, 0.25, 1],
  emphasized: [0.05, 0.7, 0.1, 1],
  calm: [0.4, 0, 0.2, 1],
  exit: [0.3, 0, 1, 1],
} as const;

export const motionDuration = {
  quick: 0.16,
  standard: 0.42,
  slow: 0.72,
} as const;

export const reveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionDuration.standard,
      ease: motionEase.emphasized,
    },
  },
};

export const revealSoft = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDuration.standard,
      ease: motionEase.standard,
    },
  },
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const staggerSlow = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};
