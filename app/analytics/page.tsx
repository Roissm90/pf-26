import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, LogOut, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { getAnalyticsSession } from "@/lib/analytics-auth";
import { logout } from "./actions";
import { DeleteEventsButton } from "./delete-events-button";
import { AnalyticsFilters } from "./filters";
import { matchingAnalyticsElements } from "@/lib/analytics-events";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Analitica", robots: { index: false, follow: false },
};
const pageSize = 50;
const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "UTC",
});
const iconButton = "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border transition-colors hover:bg-muted/20 focus-visible:outline-2 focus-visible:outline-accent";

export default async function AnalyticsPage({ searchParams }: {
  searchParams: Promise<{ page?: string; q?: string; order?: string }>;
}) {
  const supabase = await getAnalyticsSession();
  if (!supabase) redirect("/analytics/login");
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q.slice(0, 100).trim() : "";
  const order = params.order === "asc" ? "asc" : "desc";
  const matches = matchingAnalyticsElements(search);
  function pageUrl(target: number) {
    const query = new URLSearchParams({ page: String(target), order });
    if (search) query.set("q", search);
    return `/analytics?${query}`;
  }
  const requestedPage = Number(params.page ?? "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 100000
    ? requestedPage : 1;
  const from = (page - 1) * pageSize;
  let eventsQuery = supabase.from("analytics_events")
    .select("id, created_at, element, device", { count: "exact" });
  if (matches) eventsQuery = eventsQuery.in("element", matches.length ? matches : [""]);
  const { data, count, error } = await eventsQuery
    .order("created_at", { ascending: order === "asc" }).order("id", { ascending: order === "asc" })
    .range(from, from + pageSize - 1);
  if (error) throw new Error("No se pudo cargar la analitica");
  const total = count ?? 0;
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div><h1 className="text-2xl font-semibold">Analitica</h1>
          <p className="mt-2 text-sm text-muted-foreground">{total} eventos</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={pageUrl(page)} title="Actualizar" aria-label="Actualizar" className={iconButton}><RefreshCw className="h-4 w-4" /></a>
          <a href="/analytics/export" title="Descargar log.txt" aria-label="Descargar log.txt" className={iconButton}><Download className="h-4 w-4" /></a>
          <DeleteEventsButton className={iconButton} />
          <form action={logout}><button type="submit" title="Cerrar sesion" aria-label="Cerrar sesion" className={iconButton}><LogOut className="h-4 w-4" /></button></form>
        </div>
      </header>
      <AnalyticsFilters query={search} order={order} />
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-border text-muted-foreground">
            <th scope="col" className="px-3 py-4">Fecha UTC</th>
            <th scope="col" className="px-3 py-4">Elemento</th>
            <th scope="col" className="px-3 py-4">Dispositivo</th>
          </tr></thead>
          <tbody>{(data ?? []).map((event) => (
            <tr key={event.id} className="border-b border-border/60">
              <td className="whitespace-nowrap px-3 py-4 font-mono text-xs">{dateFormatter.format(new Date(event.created_at)).replaceAll("/", "-")}</td>
              <td className="break-all px-3 py-4">{event.element}</td>
              <td className="px-3 py-4">{event.device}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {!data?.length && <p className="py-12 text-center text-sm text-muted-foreground">{search ? "No hay eventos que coincidan con el filtro." : "No hay eventos en esta pagina."}</p>}
      <nav aria-label="Paginacion" className="mt-6 flex items-center justify-end gap-4">
        {page > 1 && <Link prefetch={false} href={pageUrl(page - 1)} title="Anterior" aria-label="Anterior" className={iconButton}><ArrowLeft className="h-4 w-4" /></Link>}
        <span className="text-sm">Pagina {page} de {Math.max(1, Math.ceil(total / pageSize))}</span>
        {from + pageSize < total && <Link prefetch={false} href={pageUrl(page + 1)} title="Siguiente" aria-label="Siguiente" className={iconButton}><ArrowRight className="h-4 w-4" /></Link>}
      </nav>
    </main>
  );
}