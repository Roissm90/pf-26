"use client";

import { useEffect } from "react";
import { analyticsElements } from "@/lib/analytics-events";

const allowedElements = new Set<string>(analyticsElements);

export function AnalyticsTracker() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-analytics]");
      const element = target?.dataset.analytics;
      if (!element || !allowedElements.has(element)) return;
      const payload = JSON.stringify({
        element,
        device: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
      });
      void fetch("/api/events", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: payload, keepalive: true,
      }).then((response) => {
        if (!response.ok && process.env.NODE_ENV === "development") {
          console.warn("Analytics event rejected", response.status);
        }
      }).catch(() => {
        if (process.env.NODE_ENV === "development") {
          console.warn("Analytics event could not be sent");
        }
      });
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);
  return null;
}