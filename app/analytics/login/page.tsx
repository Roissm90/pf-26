import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogIn, ArrowLeft } from "lucide-react";
import { getAnalyticsSession } from "@/lib/analytics-auth";
import { login } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Acceso a analitica", robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAnalyticsSession()) redirect("/analytics");
  const { error } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-20">
      <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Portfolio
      </Link>
      <h1 className="mb-8 text-2xl font-semibold">Acceso a analítica</h1>
      <form action={login} className="space-y-5">
        <label className="block text-sm">Email:
          <input type="email" name="email" autoComplete="username" maxLength={254} required
            className="mt-2 w-full rounded border border-border bg-background p-3 focus-visible:outline-2 focus-visible:outline-accent" />
        </label>
        <label className="block text-sm">Contraseña:
          <input type="password" name="password" autoComplete="current-password" maxLength={1024} required
            className="mt-2 w-full rounded border border-border bg-background p-3 focus-visible:outline-2 focus-visible:outline-accent" />
        </label>
        {error && <p role="alert" className="text-sm text-red-600">No se pudo iniciar sesion.</p>}
        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded bg-foreground px-4 py-3 text-sm text-background">
          <LogIn className="h-4 w-4" /> Entrar
        </button>
      </form>
    </main>
  );
}