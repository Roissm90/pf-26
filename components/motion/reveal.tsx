"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    controls.set({ opacity: 1, y: 0 });
    if (!element || shouldReduceMotion !== false || !("IntersectionObserver" in window) ||
        element.getBoundingClientRect().top <= window.innerHeight + 64) return;

    controls.set({ opacity: 0, y: 32 });
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] },
      });
    }, { rootMargin: "0px 0px 64px 0px" });
    observer.observe(element);
    return () => {
      observer.disconnect();
      controls.stop();
    };
  }, [controls, delay, shouldReduceMotion]);

  return (
    <motion.div
      ref={elementRef}
      initial={false}
      animate={controls}
      onFocusCapture={() => {
        controls.stop();
        controls.set({ opacity: 1, y: 0 });
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
