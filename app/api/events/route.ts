import { analyticsElements } from "@/lib/analytics-events";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const allowedElements = new Set<string>(analyticsElements);

export async function POST(request: Request) {
  const origin = process.env.ANALYTICS_ALLOWED_ORIGIN;
  if (!origin || request.headers.get("origin") !== origin) {
    return new Response(null, { status: 403 });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return new Response(null, { status: 415 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 1024) {
    return new Response(null, { status: 413 });
  }
  let event: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 1024) {
      return new Response(null, { status: 413 });
    }
    event = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return new Response(null, { status: 400 });
  }
  const payload = event as Record<string, unknown>;
  if (typeof payload.element !== "string" || !allowedElements.has(payload.element) ||
      (payload.device !== "mobile" && payload.device !== "desktop")) {
    return new Response(null, { status: 400 });
  }
  try {
    const { error } = await createAdminClient().from("analytics_events").insert({
      element: payload.element, device: payload.device,
    });
    if (error) {
      console.error("Analytics insert failed", error.code);
      return new Response(null, { status: 503 });
    }
  } catch {
    return new Response(null, { status: 503 });
  }
  return new Response(null, { status: 204 });
}