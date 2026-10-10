"use client";

import { RefreshCw } from "lucide-react";

export default function AnalyticsError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="text-xl font-semibold">Analitica no disponible</h1>
      <p role="alert" className="mt-3 text-sm text-muted-foreground">No se pudieron cargar los datos.</p>
      <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded border border-border px-4 py-2">
        <RefreshCw className="h-4 w-4" /> Reintentar
      </button>
    </main>
  );
}