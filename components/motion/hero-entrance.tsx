"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

export function TypewriterText({ text }: { text: string }) {
  return (
    <span>
      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0 }}>{text}</span>
      <span aria-hidden="true" data-hero-text>
        {text.split(" ").map((word, wordIndex) => (
          <span key={wordIndex}>
            {wordIndex > 0 && " "}
            <span className="inline-block">
              {Array.from(word).map((character, characterIndex) => (
                <span key={characterIndex} data-hero-letter>{character}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function HeroEntrance({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!container || preference.matches || window.scrollY > 96 ||
        (window.location.hash && window.location.hash !== "#top")) return;

    const animations: Animation[] = [];
    let delay = 100;
    for (const text of container.querySelectorAll<HTMLElement>("[data-hero-text]")) {
      for (const letter of text.querySelectorAll<HTMLElement>("[data-hero-letter]")) {
        animations.push(letter.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 160,
          delay,
          easing: "ease-out",
          fill: "both",
        }));
        delay += 60;
      }
      delay += 240;
    }
    for (const element of container.querySelectorAll<HTMLElement>("[data-hero-reveal]")) {
      animations.push(element.animate([
        { opacity: 0, transform: "translateY(32px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 900, delay, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fill: "both" }));
      delay += 120;
    }

    function finish() {
      for (const animation of animations) animation.cancel();
    }
    function handleVisibility() {
      if (document.hidden) finish();
    }
    container.addEventListener("focusin", finish);
    window.addEventListener("scroll", finish, { passive: true });
    window.addEventListener("pagehide", finish);
    document.addEventListener("visibilitychange", handleVisibility);
    preference.addEventListener("change", finish);
    return () => {
      finish();
      container.removeEventListener("focusin", finish);
      window.removeEventListener("scroll", finish);
      window.removeEventListener("pagehide", finish);
      document.removeEventListener("visibilitychange", handleVisibility);
      preference.removeEventListener("change", finish);
    };
  }, []);

  return <div ref={containerRef} className="contents">{children}</div>;
}