"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    visible: {
      opacity: shouldReduceMotion ? 1 : [0, 1],
      y: shouldReduceMotion ? 0 : [16, 0],
      transition: { duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
