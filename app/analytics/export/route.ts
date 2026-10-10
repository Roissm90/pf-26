import { getAnalyticsSession } from "@/lib/analytics-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type EventRow = { id: string; created_at: string; element: string; device: string };

export async function GET(request: Request) {
  const supabase = await getAnalyticsSession();
  if (!supabase) return new Response(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  const cutoff = new Date().toISOString();
  let cursor: EventRow | undefined;
  async function getBatch(): Promise<EventRow[]> {
    let query = supabase!.from("analytics_events").select("id, created_at, element, device")
      .lte("created_at", cutoff).order("created_at", { ascending: true })
      .order("id", { ascending: true }).limit(500);
    if (cursor) {
      query = query.or(`created_at.gt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.gt.${cursor.id})`);
    }
    const { data, error } = await query;
    if (error) throw new Error("No se pudo exportar la analitica");
    return (data ?? []) as EventRow[];
  }
  let batch: EventRow[];
  try {
    batch = await getBatch();
  } catch {
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (request.signal.aborted) { controller.close(); return; }
      try {
        const text = batch.map((event) => JSON.stringify({
          date: new Date(event.created_at).toISOString(), element: event.element, device: event.device,
        })).join("\n");
        if (text) controller.enqueue(encoder.encode(text + "\n"));
        if (batch.length < 500) { controller.close(); return; }
        cursor = batch[batch.length - 1];
        batch = await getBatch();
      } catch (error) { controller.error(error); }
    },
  });
  return new Response(stream, { headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Disposition": 'attachment; filename="log.txt"',
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
  } });
}