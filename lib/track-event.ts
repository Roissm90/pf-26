"use client";

import { analyticsElements } from "@/lib/analytics-events";

const allowedElements = new Set<string>(analyticsElements);

export function trackEvent(element: string) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true" || !allowedElements.has(element)) return;
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