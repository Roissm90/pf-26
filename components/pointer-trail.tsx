"use client";

import { useEffect, useRef } from "react";

const particleCount = 18;
const lifetime = 500;

export function PointerTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const preference = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const particles = Array.from(container.children, (element) => ({
      element: element as HTMLElement,
      x: 0,
      y: 0,
      born: -Infinity,
    }));
    let frame = 0;
    let nextParticle = 0;
    let lastTime = 0;
    let lastX = -Infinity;
    let lastY = -Infinity;

    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastX = -Infinity;
      lastY = -Infinity;
      for (const particle of particles) {
        particle.born = -Infinity;
        particle.element.style.opacity = "0";
      }
    }

    function render(now: number) {
      frame = 0;
      let active = false;
      for (const particle of particles) {
        const progress = (now - particle.born) / lifetime;
        if (progress >= 1) {
          particle.element.style.opacity = "0";
          continue;
        }
        active = true;
        particle.element.style.opacity = String((1 - progress) * 0.45);
        particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y - progress * 6}px, 0) scale(${1 - progress * 0.65})`;
      }
      if (active) frame = requestAnimationFrame(render);
    }

    function handleMove(event: PointerEvent) {
      if (!preference.matches || event.pointerType !== "mouse") return;
      if (event.target instanceof Element && event.target.closest("a, button, input, select, textarea, [role='button'], [contenteditable]")) {
        clear();
        return;
      }
      const now = performance.now();
      if (now - lastTime < 24 || Math.hypot(event.clientX - lastX, event.clientY - lastY) < 12) return;
      const particle = particles[nextParticle];
      particle.x = event.clientX - 2;
      particle.y = event.clientY - 2;
      particle.born = now;
      nextParticle = (nextParticle + 1) % particleCount;
      lastTime = now;
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    }

    document.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", clear);
    document.addEventListener("visibilitychange", clear);
    window.addEventListener("blur", clear);
    window.addEventListener("scroll", clear, { passive: true });
    preference.addEventListener("change", clear);
    return () => {
      clear();
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", clear);
      document.removeEventListener("visibilitychange", clear);
      window.removeEventListener("blur", clear);
      window.removeEventListener("scroll", clear);
      preference.removeEventListener("change", clear);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {Array.from({ length: particleCount }, (_, index) => (
        <span key={index} className="absolute left-0 top-0 h-[8px] w-[8px] rounded-full bg-accent opacity-0" />
      ))}
    </div>
  );
}