"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownUp, LoaderCircle, Search, X } from "lucide-react";

export function AnalyticsFilters({ query, order }: { query: string; order: "asc" | "desc" }) {
  const router = useRouter();
  const [search, setSearch] = useState(query);
  const [sort, setSort] = useState(order);
  const [pending, startTransition] = useTransition();
  const lastRequest = useRef(JSON.stringify([query, order]));

  useEffect(() => {
    const signature = JSON.stringify([search.trim(), sort]);
    if (signature === lastRequest.current) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      params.set("order", sort);
      lastRequest.current = signature;
      startTransition(() => router.replace(`/analytics?${params}`, { scroll: false }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sort, router]);

  useEffect(() => {
    function restoreFilters() {
      const params = new URLSearchParams(window.location.search);
      const restoredQuery = params.get("q") ?? "";
      const restoredOrder = params.get("order") === "asc" ? "asc" : "desc";
      lastRequest.current = JSON.stringify([restoredQuery, restoredOrder]);
      setSearch(restoredQuery);
      setSort(restoredOrder);
    }
    window.addEventListener("popstate", restoreFilters);
    return () => window.removeEventListener("popstate", restoreFilters);
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center" aria-busy={pending}>
      <div className="relative min-w-0 flex-1">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          aria-label="Filtrar eventos"
          placeholder="Buscar eventos..."
          maxLength={100}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 w-full appearance-none rounded border border-border bg-background pl-10 pr-12 text-sm focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-search-cancel-button]:appearance-none"
        />
        {pending ? (
          <LoaderCircle aria-label="Actualizando resultados" className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
        ) : search && (
          <button type="button" onClick={() => setSearch("")} title="Limpiar filtro" aria-label="Limpiar filtro"
            className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded hover:bg-muted/20">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <label className="flex h-10 shrink-0 items-center gap-2 rounded border border-border px-3">
        <ArrowDownUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        <select aria-label="Ordenar por fecha" value={sort} onChange={(event) => setSort(event.target.value === "asc" ? "asc" : "desc")}
          className="h-full min-w-0 flex-1 bg-background text-sm focus-visible:outline-2 focus-visible:outline-accent">
          <option value="desc">Mas recientes primero</option>
          <option value="asc">Mas antiguos primero</option>
        </select>
      </label>
    </div>
  );
}