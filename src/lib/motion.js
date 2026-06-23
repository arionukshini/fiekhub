export const smoothEase = [0.16, 1, 0.3, 1]

export const pageTransition = {
  duration: 0.18,
  ease: smoothEase,
}

export const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: pageTransition,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.08,
      ease: smoothEase,
    },
  },
}

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.02,
      staggerChildren: 0.04,
    },
  },
}

export const revealItem = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: smoothEase,
    },
  },
}

export const subtleScale = {
  rest: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -2,
    scale: 1.012,
    transition: {
      duration: 0.28,
      ease: smoothEase,
    },
  },
  tap: {
    y: 0,
    scale: 0.97,
  },
}

export const interactiveRevealItem = {
  ...revealItem,
  hover: subtleScale.hover,
  tap: subtleScale.tap,
}

export const revealViewport = {
  once: true,
  amount: 0.22,
}
