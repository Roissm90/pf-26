# Analitica privada con Supabase y Vercel

Esta guia esta adaptada al proyecto: Next.js 16.4, App Router, React y TypeScript. La funcionalidad ya esta implementada; los bloques siguientes son una referencia, no necesitas volver a crear los archivos.

Estado de verificacion local: ESLint, TypeScript y build pasan. Sin sesion, el panel redirige al login y la exportacion devuelve 401. La URL de Supabase ya esta corregida y la insercion real devuelve 204. El propietario ha confirmado el acceso al panel y la lectura del registro. La captura usa fetch con keepalive y los clics de GitHub se guardan en Supabase. Verifica tambien la descarga autenticada antes de desplegar. Nunca compartas claves ni contrasenas para estas comprobaciones.

## 1. Que vamos a construir

El flujo sera: clic en un elemento marcado -> POST a `/api/events` -> tabla en Supabase -> consulta privada en `/analytics`.

Guardaremos fecha UTC generada por Postgres, identificador del elemento y `mobile` o `desktop`. No guardaremos IP, correo del visitante, URL completa, texto libre ni un identificador persistente del visitante. El ID tecnico de cada fila sirve para ordenar los registros, no identifica personas.

La contrasena sera la de una cuenta tuya en Supabase Auth, con correo y contrasena. No sera una contrasena compartida escrita en el frontend. Solo el UUID de esa cuenta podra leer los registros.

`log.txt` se descargara bajo demanda desde los datos de Supabase; no se escribe en el disco de Vercel.

En esta primera version, `mobile` significa ventana de menos de 768 px de ancho EN EL MOMENTO DEL CLIC. Incluye tablets estrechas y ventanas pequenas en ordenadores. Es una medida del contexto responsive, no una deteccion fiable del hardware. Si prefieres tipo de dispositivo, cambia el criterio y documenta como clasificas tablets; el User-Agent tampoco es infalible.

## 2. Crear el proyecto en Supabase

1. Entra en https://supabase.com y crea una cuenta o inicia sesion.
2. Abre el Dashboard y crea una organizacion si te lo solicita.
3. Pulsa New project, selecciona la organizacion y usa un nombre como `portfolio-analytics`.
4. Genera una contrasena fuerte para la BASE DE DATOS y guardala en tu gestor de contrasenas. No es la contrasena del panel privado y el codigo de esta guia no la utiliza.
5. Elige una region europea cercana a tus usuarios y, si es posible, a la region de las funciones en Vercel.
6. Espera a que el proyecto este listo.
7. En Connect obtiene la Project URL y la Publishable key, con formato `sb_publishable_...`.
8. En Settings > API Keys crea o consulta una Secret key, con formato `sb_secret_...`. Puedes llamarla `portfolio-events`.

Los nombres de las pantallas pueden cambiar. Usa las claves nuevas, no necesitas las antiguas `anon` y `service_role`. La clave secreta evita RLS y nunca debe aparecer en el navegador, Git, capturas publicas ni mensajes de chat.

Revisa los limites y condiciones actuales del plan en https://supabase.com/pricing. No des por garantizado que un proyecto gratuito tenga disponibilidad permanente, backups automaticos o recursos ilimitados; revisa la politica vigente de pausa por inactividad.

## 3. Crear TU usuario del panel

1. En Authentication > Sign In / Providers, comprueba que el proveedor Email esta habilitado.
2. Desactiva Allow new users to sign up. No queremos registro publico.
3. En Authentication > Users utiliza Add user > Create new user.
4. Introduce TU correo y una contrasena larga, unica y generada por tu gestor.
5. Marca Auto Confirm User si esta disponible. Asi puedes entrar sin implementar un flujo de confirmacion por correo.
6. Copia el UUID del usuario creado. Lo necesitas para la politica SQL y `ANALYTICS_ADMIN_USER_ID`.
7. En Authentication > URL Configuration configura inicialmente Site URL como `http://localhost:3000`.

No crees una cuenta distinta para cada visitante. Los visitantes envian eventos sin iniciar sesion. La cuenta anterior solo sirve para tu panel.

Este ejemplo no incorpora recuperacion de contrasena por correo. Para recuperar el acceso, administra tu usuario desde el Dashboard de Supabase. Antes de ofrecer recuperacion por email, configura SMTP, URLs permitidas y una ruta de callback; no hace falta para este panel personal.

## 4. Crear y proteger la tabla

Abre SQL Editor > New query. Sustituye `TU_UUID_ADMIN` por el UUID del paso anterior ANTES de ejecutar. Ejecuta una vez esta consulta y conserva la version con el UUID real como migracion cuando implementes la funcionalidad.

```sql
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  element text not null
    check (char_length(element) between 1 and 100),
  device text not null check (device in ('mobile', 'desktop'))
);

create index analytics_events_date_id_idx
  on public.analytics_events (created_at desc, id desc);

alter table public.analytics_events enable row level security;

revoke all on table public.analytics_events from anon, authenticated;
grant select on table public.analytics_events to authenticated;
grant insert on table public.analytics_events to service_role;

create policy "Only the analytics owner can read events"
on public.analytics_events
for select
to authenticated
using ((select auth.uid()) = 'TU_UUID_ADMIN'::uuid);
```

No crees politicas de INSERT para `anon`, ni una politica de SELECT con `using (true)`. No desactives RLS para solucionar errores.

La API de tu servidor insertara mediante la clave secreta. Las consultas del panel usaran la sesion de tu usuario y la clave publicable, con RLS como segunda barrera. Estar autenticado NO basta: debe ser el UUID autorizado.

El SQL no es idempotente: si ya lo ejecutaste, no vuelvas a ejecutar la creacion de tabla/politica. Para cambiar el propietario, modifica la politica y la variable de entorno de forma coordinada.

## 5. Instalar dependencias y configurar el entorno local

Desde la terminal del proyecto:

```bash
npm install @supabase/supabase-js @supabase/ssr server-only
```

Crea un archivo `.env.local` en la raiz con estas variables, usando tus valores reales:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_VALOR
SUPABASE_SECRET_KEY=sb_secret_TU_VALOR
ANALYTICS_ADMIN_USER_ID=TU_UUID_ADMIN
ANALYTICS_ALLOWED_ORIGIN=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

La URL permitida no lleva barra final. Si usas otro puerto, actualiza esa variable.

Comprueba que Git ignora `.env.local`:

```bash
git check-ignore .env.local
```

Debe imprimir el nombre del archivo. Si no lo hace, agrega `.env.local` a las reglas de ignore ANTES de hacer commits. Puedes versionar un `.env.example` con valores ficticios, nunca las claves reales. Reinicia `npm run dev` cuando cambies variables.

## 6. Crear los clientes de Supabase

Los nombres de archivo siguientes son archivos NUEVOS que debes crear durante la implementacion. No hace falta crear un cliente de Supabase para el navegador: la captura solo llama a tu API.

### `lib/supabase/admin.ts`

```ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    },
  );
}
```

No importes este archivo desde un componente con `"use client"`. `server-only` ayuda a detectar ese error al compilar.

### `lib/supabase/server.ts`

```ts
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSessionClient(writable = false) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          if (!writable) return;
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    },
  );
}
```

Los Server Components no escriben cookies. El proxy del siguiente paso renueva y escribe la sesion antes del renderizado. Las acciones de login y logout usan createSessionClient(true) para permitir escrituras y no ocultar fallos. Las cookies HttpOnly son adecuadas aqui porque NO usamos un cliente de Auth en el navegador.

### `lib/analytics-auth.ts`

```ts
import "server-only";
import { createSessionClient } from "@/lib/supabase/server";

export async function getAnalyticsSession() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user || data.user.id !== process.env.ANALYTICS_ADMIN_USER_ID) {
    return null;
  }

  return supabase;
}
```

`getUser()` verifica el usuario con Supabase Auth. No uses `getSession()` como prueba de identidad ni confies solo en que exista una cookie.

## 7. Renovar la sesion en Next.js 16

Crea `proxy.ts` en la raiz, junto a `app`, NO dentro de `app`. Next.js 16 utiliza `proxy.ts`, no el antiguo `middleware.ts`. Si en el futuro ya existe un proxy, integra esto en el existente en lugar de crear un segundo.

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          for (const [name, value] of Object.entries(headers ?? {})) {
            response.headers.set(name, value);
          }
          response.headers.set("Cache-Control", "private, no-store");
        },
      },
    },
  );

  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: ["/analytics/:path*"],
};
```

El proxy renueva la sesion; NO sustituye la autorizacion en las paginas y la descarga. Devuelve la respuesta que contiene las cookies renovadas. Nunca caches respuestas privadas o respuestas con `Set-Cookie` en un CDN compartido.

## 8. Definir los eventos permitidos

Crea `lib/analytics-events.ts`. Solo se aceptaran estos identificadores; no enviaremos texto del DOM ni URLs introducidas por usuarios.

```ts
import { navigationLinks, projects } from "@/content/data";

export const analyticsElements = [
  "contact-email",
  "social-github",
  "social-linkedin",
  "social-email",
  ...projects.map((project) => project.analyticsId),
  ...navigationLinks.map((link) => link.analyticsId),
  "navigation-top",
  "resume-download",
] as const;
```

Cada proyecto define un analyticsId obligatorio en content/data.ts, por ejemplo analyticsId: "project-endesa". La lista permitida se obtiene automaticamente de esos campos. Usa valores unicos, estables y de entre 1 y 100 caracteres; cambiar el titulo no modifica el identificador. Para otros elementos, actualiza esta lista y el atributo correspondiente.

## 9. Crear la ruta que guarda eventos

Crea `app/api/events/route.ts`:

```ts
import { analyticsElements } from "@/lib/analytics-events";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const allowedElements = new Set<string>(analyticsElements);

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.ANALYTICS_ALLOWED_ORIGIN;

  if (!allowedOrigin || origin !== allowedOrigin) {
    return new Response(null, { status: 403 });
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return new Response(null, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > 1024) return new Response(null, { status: 413 });

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
  if (
    typeof payload.element !== "string" ||
    !allowedElements.has(payload.element) ||
    (payload.device !== "mobile" && payload.device !== "desktop")
  ) {
    return new Response(null, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("analytics_events").insert({
    element: payload.element,
    device: payload.device,
  });

  if (error) {
    console.error("Analytics insert failed", error.code);
    return new Response(null, { status: 503 });
  }

  return new Response(null, { status: 204 });
}
```

Aunque alguien envie `created_at`, el servidor lo ignora: la fecha la establece Postgres. No devuelvas registros ni detalles internos del error desde esta ruta publica. No se habilita CORS para otros sitios.

IMPORTANTE: comprobar Origin y validar campos NO impide a un bot simular peticiones. Esta ruta es publica por necesidad. El limite de bytes tras leer el cuerpo tampoco sustituye los limites de infraestructura para peticiones grandes. El paso de proteccion en Vercel al final es importante antes de publicar.

## 10. Capturar clics sin bloquear la navegacion

Crea `components/analytics-tracker.tsx`:

```tsx
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
```

`fetch` con `keepalive` permite continuar el envio cuando un clic navega a otra pagina o abre el correo, sin bloquear la navegacion. Una respuesta 204 confirma la insercion; el componente implementado avisa en la consola de desarrollo si falla el envio. No hay reintentos automaticos que puedan duplicar registros.

Se usa `closest` para que pulsar en un icono dentro del enlace registre el enlace. El listener se limpia correctamente, tambien durante los ciclos de desarrollo de React. El ejemplo mide clics principales, incluidos los activados por teclado; NO mide clic derecho ni clic central (`auxclick`).

En `app/page.tsx`, agrega el import y monta una sola instancia dentro del fragmento de Home:

```tsx
import { AnalyticsTracker } from "@/components/analytics-tracker";
```

```tsx
<>
  <AnalyticsTracker />
  <Navbar />
  {/* Mantener el resto de Home exactamente como esta. */}
</>
```

El bloque anterior es una indicacion de ubicacion, no un reemplazo completo de la pagina. Montarlo en Home y no en el layout global evita capturar clics dentro de tu panel.

## 11. Marcar los elementos del portfolio

No cambies `href`, estilos ni comportamiento. Solo agrega el atributo a los elementos que ya existen.

En el enlace de correo de `components/contact.tsx`:

```tsx
<a
  data-analytics="contact-email"
  href={`mailto:${personalInfo.email}`}
  className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
>
  {personalInfo.email}
</a>
```

En el enlace de cada social de ese mismo componente, agrega:

```tsx
data-analytics={`social-${social.label.toLowerCase()}`}
```

En `components/project-card.tsx`, el enlace que cubre toda la tarjeta es el `<a>` final con `className="absolute inset-0 z-10"`. Agrega a ESE enlace:

```tsx
data-analytics={project.analyticsId}
```

No lo pongas en el `<article>` ademas del enlace. El enlace de repositorio es independiente: si quieres medirlo, agrega otro identificador permitido como `project-endesa-repo` a la lista y al enlace de repositorio correspondiente. No se mide automaticamente en este ejemplo.

En el enlace que descarga el CV, agrega `data-analytics="resume-download"`. Asegurate de que el archivo del CV existe; medir un clic no demuestra que la descarga haya terminado.

Tambien esta instrumentada la navegacion interna: navigation-top (iniciales), navigation-about (menu y flecha), navigation-skills (Stack), navigation-projects (menu y Ver proyectos) y navigation-contact (Contacto). Los enlaces del menu se definen en navigationLinks, en content/data.ts, con su analyticsId; escritorio y movil comparten identificadores. El boton para abrir/cerrar el menu y el cambio de tema no se registran.

La lista de Formacion y certificados esta integrada bajo Sobre mi. Sus enlaces e identificadores se configuran en education, en content/data.ts: education-bootcamp (credencial externa), education-ia (PDF de inteligencia artificial) y education-bachiller (PDF de bachillerato). La lista permitida y el buscador obtienen estos datos automaticamente. Puedes filtrar por formacion, certificados, estudios, bootcamp, IA, bachiller o PDF. Los terminos de una o dos letras se comparan como palabras completas para evitar que IA coincida accidentalmente con social o credencial. Los documentos publicos son accesibles a cualquier visitante; revisa su contenido antes de publicar informacion personal.

## 12. Crear las acciones de acceso y salida

Crea `app/analytics/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" || email.length > 254 ||
    typeof password !== "string" || password.length > 1024
  ) {
    redirect("/analytics/login?error=1");
  }

  const supabase = await createSessionClient(true);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user || data.user.id !== process.env.ANALYTICS_ADMIN_USER_ID) {
    await supabase.auth.signOut();
    redirect("/analytics/login?error=1");
  }

  redirect("/analytics");
}

export async function logout() {
  const supabase = await createSessionClient(true);
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("No se pudo cerrar la sesion");
  redirect("/analytics/login");
}
```

El mensaje de error sera generico: no revelamos si existe el correo. Next.js comprueba el origen de las Server Actions; no desactives esa comprobacion. Supabase aplica limites de Auth, pero tambien conviene proteger intentos de acceso en la infraestructura.

## 13. Crear la pantalla de acceso

Crea `app/analytics/login/page.tsx`:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAnalyticsSession } from "@/lib/analytics-auth";
import { login } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Acceso a analitica",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAnalyticsSession()) redirect("/analytics");
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Acceso a analitica</h1>
      <form action={login} className="space-y-4">
        <label className="block">
          Correo
          <input type="email" name="email" autoComplete="username" required
            className="mt-1 w-full rounded border border-border bg-background p-2" />
        </label>
        <label className="block">
          Contrasena
          <input type="password" name="password" autoComplete="current-password" required
            className="mt-1 w-full rounded border border-border bg-background p-2" />
        </label>
        {error && <p role="alert">No se pudo iniciar sesion.</p>}
        <button type="submit" className="rounded bg-foreground px-4 py-2 text-background">
          Entrar
        </button>
      </form>
    </main>
  );
}
```

## 14. Crear el panel paginado

Crea `app/analytics/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAnalyticsSession } from "@/lib/analytics-auth";
import { logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Analitica",
  robots: { index: false, follow: false },
};

const pageSize = 50;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await getAnalyticsSession();
  if (!supabase) redirect("/analytics/login");

  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 100000
    ? requestedPage : 1;
  const from = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from("analytics_events")
    .select("id, created_at, element, device", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) throw new Error("No se pudo cargar la analitica");
  const total = count ?? 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Analitica</h1>
        <div className="flex flex-wrap items-center gap-4">
          <a href="/analytics/export">Descargar log.txt</a>
          <form action={logout}><button type="submit">Cerrar sesion</button></form>
        </div>
      </div>
      <p className="my-6">{total} eventos</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-2">Fecha UTC</th>
              <th className="p-2">Elemento</th>
              <th className="p-2">Dispositivo</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((event) => (
              <tr key={event.id} className="border-b border-border">
                <td className="whitespace-nowrap p-2">{new Date(event.created_at).toISOString()}</td>
                <td className="break-all p-2">{event.element}</td>
                <td className="p-2">{event.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data?.length && <p className="my-6">No hay eventos en esta pagina.</p>}
      <nav aria-label="Paginacion" className="mt-6 flex flex-wrap items-center gap-6">
        {page > 1 && <Link prefetch={false} href={`/analytics?page=${page - 1}`}>Anterior</Link>}
        <span>Pagina {page}</span>
        {from + pageSize < total && <Link prefetch={false} href={`/analytics?page=${page + 1}`}>Siguiente</Link>}
      </nav>
    </main>
  );
}
```

Todos los registros pueden consultarse pasando paginas; no cargamos miles en el navegador. El total es de eventos, NO de personas unicas. El panel actualiza al recargar, no usa Realtime. Si llegan eventos mientras navegas, la paginacion por offset puede repetir o desplazar alguna fila entre paginas; para una fotografia fija usa la exportacion o incorpora paginacion por cursor en una siguiente version.

El panel implementado incluye busqueda automatica con un retardo de 300 ms y orden por fecha ascendente o descendente. La busqueda ignora mayusculas y acentos y requiere que coincidan todas las palabras. Usa grupos y nombres: proye incluye tarjetas de proyectos y navigation-projects; endesa solo su proyecto; redes incluye GitHub y LinkedIn; contacto incluye correo y navigation-contact. Los nombres de proyectos se obtienen de content/data.ts. La consulta filtra antes de contar y paginar en Supabase, no solo sobre las 50 filas visibles. El cambio de busqueda u orden vuelve a la primera pagina; paginacion y actualizar conservan q y order en la URL. La descarga log.txt y la papelera siguen actuando sobre TODO el historial, independientemente del filtro. El comportamiento se ha verificado con 1100 filas simuladas; la comprobacion visual del panel requiere una sesion del propietario.

No anadas `/analytics` al sitemap. Los metadatos `noindex` no protegen datos: la seguridad la aportan la sesion, el UUID autorizado y RLS.

## 15. Descargar el historial como log.txt

El panel incluye tambien una papelera para borrar todos los registros de analytics_events. Solicita confirmacion con un popup que advierte que la accion no tiene vuelta atras. La accion del servidor verifica el UUID del propietario antes de usar la clave secreta; no necesitas abrir permisos DELETE a usuarios publicos. Tras borrar, vuelve a la primera pagina. Solo elimina eventos, no usuarios ni tablas; los nuevos clics seguiran registrandose. Descarga log.txt antes si necesitas conservar el historial. Las pruebas de desarrollo de este control usan clientes simulados, sin borrar datos reales.

Crea `app/analytics/export/route.ts`. Consulta por lotes de 500 para no quedarse solo con las primeras 1000 filas. Usa un cursor por fecha e ID y transmite el resultado sin acumularlo entero en memoria.

```ts
import { getAnalyticsSession } from "@/lib/analytics-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  created_at: string;
  element: string;
  device: string;
};

export async function GET(request: Request) {
  const supabase = await getAnalyticsSession();
  if (!supabase) {
    return new Response(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const cutoff = new Date().toISOString();
  let cursor: EventRow | undefined;

  async function getBatch(): Promise<EventRow[]> {
    let query = supabase!
      .from("analytics_events")
      .select("id, created_at, element, device")
      .lte("created_at", cutoff)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(500);

    if (cursor) {
      query = query.or(
        `created_at.gt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.gt.${cursor.id})`,
      );
    }

    const { data, error } = await query;
    if (error) throw new Error("No se pudo exportar la analitica");
    return (data ?? []) as EventRow[];
  }

  let firstBatch: EventRow[];
  try {
    firstBatch = await getBatch();
  } catch {
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (request.signal.aborted) {
        controller.close();
        return;
      }
      try {
        const batch = firstBatch;
        const text = batch.map((event) => JSON.stringify({
          date: new Date(event.created_at).toISOString(),
          element: event.element,
          device: event.device,
        })).join("\n");

        if (text) controller.enqueue(encoder.encode(text + "\n"));
        if (batch.length < 500) {
          controller.close();
          return;
        }
        cursor = batch[batch.length - 1];
        firstBatch = await getBatch();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="log.txt"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
```

El formato es JSON por linea, por ejemplo:

```json
{"date":"2026-10-10T15:32:08.000Z","element":"contact-email","device":"mobile"}
```

Se exportan los eventos anteriores al inicio de la descarga. No es un snapshot transaccional estricto: transacciones concurrentes o borrados durante la exportacion pueden alterar el resultado. No borres datos durante una exportacion. Si una consulta posterior falla, se interrumpe la descarga; no consideres un archivo incompleto un backup valido.

Para un portfolio pequeno esto es suficiente. Para millones de filas, exportaciones con snapshot consistente o descargas que excedan la duracion maxima de una funcion de Vercel, usa un trabajo de exportacion y un archivo en Supabase Storage, con bucket privado y URL firmada. Streaming NO elimina los limites de duracion de Vercel.

## 16. Pruebas locales, en este orden

1. Ejecuta los controles del proyecto:

```bash
npm run lint
npm run build
```

2. Ejecuta `npm run dev` y abre http://localhost:3000. Si el puerto cambia, actualiza el origen permitido y reinicia el servidor.
3. Abre DevTools > Network y pulsa el correo. Deberias ver POST `/api/events` con respuesta 204. Una respuesta 204 significa que la insercion ha terminado correctamente.
4. En Supabase > Table Editor > analytics_events verifica `element`, `device` y `created_at`. El Dashboard utiliza privilegios administrativos: que veas filas ahi NO demuestra que sean publicas.
5. Activa una pantalla de menos de 768 px en DevTools, pulsa otro elemento y verifica `mobile`. Vuelve a una pantalla amplia y comprueba `desktop`.
6. Pulsa en el icono interior de una red social y confirma que aparece un solo registro.
7. Pulsa en la tarjeta de un proyecto y comprueba su identificador. Comprueba que los enlaces siguen navegando normalmente.
8. Abre http://localhost:3000/analytics en incognito: debe redirigir a login y no mostrar datos.
9. Abre http://localhost:3000/analytics/export en incognito: debe devolver 401, no el archivo.
10. Prueba una contrasena incorrecta: debe mostrar el error generico. Entra con tu cuenta: debes ver la tabla.
11. Cierra sesion y vuelve a intentar acceder al panel y a la descarga. Deben bloquearse otra vez.
12. Deja abierta la sesion el tiempo suficiente para que se renueve el token y vuelve al panel: comprueba que el proxy conserva la sesion.
13. Prueba un identificador inventado con el comando siguiente: debe devolver 400 y no insertar nada.

```bash
curl -i http://localhost:3000/api/events \
  -H 'Origin: http://localhost:3000' \
  -H 'Content-Type: application/json' \
  --data '{"element":"evento-inventado","device":"desktop"}'
```

14. Repite con un Origin diferente: debe devolver 403. Comprueba que `device: "tablet"` da 400.
15. Verifica que la clave publicable SIN sesion no puede leer la tabla, usando tus valores publicables (NO la clave secreta):

```bash
curl -i 'https://TU_PROYECTO.supabase.co/rest/v1/analytics_events?select=*' \
  -H 'apikey: sb_publishable_TU_VALOR'
```

Debe rechazar el acceso; nunca debe devolver los eventos. Tambien debe rechazar INSERT sin privilegios. Para verificar aislamiento entre usuarios, puedes crear temporalmente otro usuario confirmado y comprobar que no puede entrar al panel; RLS tampoco debe darle filas. Eliminalo al terminar.

16. Para verificar paginacion y exportacion de mas de 1000 filas, usa preferentemente un proyecto de prueba. Puedes generar registros sinteticos en SQL Editor:

```sql
insert into public.analytics_events (element, device)
select 'contact-email', 'desktop'
from generate_series(1, 1100);
```

Comprueba todas las paginas y que la descarga contiene las 1100 filas de prueba, mas las previas. No ejecutes esta prueba en produccion: contaminaria los datos reales. Para limpiar, elimina solo los IDs de prueba identificados, o recrea el proyecto de prueba; no borres indiscriminadamente el historial real.

17. Revisa que el HTML y las respuestas publicas no contienen claves secretas, cookies de sesion ni datos privados. La fecha se muestra expresamente en UTC para evitar ambiguedades de zona horaria.

## 17. Desplegar en Vercel

1. Guarda tus cambios de codigo en tu repositorio de Git. No incluyas `.env.local`. Versiona tambien el lockfile generado por npm.
2. En Vercel, Add New > Project, importa el repositorio y selecciona el framework Next.js. Deja la raiz del proyecto como esta si no hay monorepo.
3. En Settings > Environment Variables configura las mismas seis variables del paso local, para Production.
4. Usa la URL real de produccion, por ejemplo `https://tu-portfolio.vercel.app`, en `ANALYTICS_ALLOWED_ORIGIN`. Sin barra final. Si aun no la sabes, haz un primer despliegue con `NEXT_PUBLIC_ANALYTICS_ENABLED=false`, obten la URL, corrige las variables y vuelve a desplegar con `true`.
5. Manten la clave secreta solo como `SUPABASE_SECRET_KEY`, nunca con prefijo `NEXT_PUBLIC_`. El UUID debe coincidir con la politica SQL.
6. En Supabase > Authentication > URL Configuration cambia Site URL al dominio final de produccion. Este login por contrasena no utiliza un callback, pero los futuros enlaces de recuperacion/confirmacion si dependeran de esta configuracion.
7. En `app/layout.tsx`, cambia el `metadataBase` de ejemplo por tu dominio real. Revisa tambien el dominio utilizado por sitemap y robots si lo has dejado como placeholder.
8. Despliega. Cualquier cambio de variables en Vercel requiere un NUEVO despliegue; cambiar la variable no modifica un despliegue existente. Las variables `NEXT_PUBLIC_` se incorporan durante el build.
9. Si usas dominio propio, usa ese dominio como origen permitido y redirige los dominios alternativos al canonico. Este ejemplo acepta UN origen: los otros no registraran eventos.
10. Repite las pruebas de captura, login, incognito, logout y exportacion en produccion. Comprueba que las cookies de Auth tienen HttpOnly, Secure y SameSite=Lax.

No necesitas abrir puertos de Postgres ni usar la contrasena de base de datos en Vercel: esta solucion conecta con Supabase por HTTPS mediante su Data API.

### Evitar que las previews contaminen los datos

En Preview establece `NEXT_PUBLIC_ANALYTICS_ENABLED=false`. Si quieres probar el panel tambien en previews, usa preferiblemente OTRO proyecto Supabase con su propia tabla, usuario, UUID y claves. No configures secretos de produccion en despliegues de PRs no confiables.

Para probar captura en una preview habilitala y configura su origen exacto antes de redesplegar. Si su URL cambia, el origen debe cambiar. No aceptes cualquier dominio `*.vercel.app` ni derives la confianza del Origin recibido.

## 18. Proteccion frente a abuso antes de publicar

La integridad de los datos no puede garantizarse: cualquier visitante puede simular un clic. La comprobacion de origen evita envios de navegadores desde otros sitios, pero un script puede falsificar ese header.

1. En Vercel abre Security / Firewall y revisa las opciones disponibles en tu plan.
2. Si tu plan permite reglas de rate limiting, crea una regla para la ruta `/api/events`, metodo POST, agrupada por IP, por ejemplo 60 peticiones por minuto, con bloqueo temporal al excederla. Ajusta el umbral tras observar trafico real: redes compartidas pueden producir falsos positivos.
3. Aplica tambien limites a intentos de POST de `/analytics/login`; el formulario usa una Server Action en esa ruta. Verifica ademas los limites de Supabase Auth.
4. Prueba que el exceso de peticiones queda bloqueado sin tocar la base de datos. Los nombres, unidades y acciones del panel de Firewall pueden variar; verifica los valores efectivos y disponibilidad, no asumas que todas estas funciones son gratuitas.
5. Si tu plan no tiene rate limiting, para una proteccion equivalente necesitas anadir un limitador distribuido (por ejemplo Redis/Upstash) en la API. No sirve un contador en memoria de una funcion de Vercel: las instancias no comparten memoria.
6. Un challenge interactivo en `/api/events` puede impedir `sendBeacon`, porque no puede mostrar una pantalla de verificacion. Para controles mas fuertes hay que integrar un token de verificacion en el cliente y validarlo en el servidor, aceptando el impacto sobre la medicion.
7. Monitoriza uso de funciones, errores 503, almacenamiento y limites de Supabase. Configura avisos y controles de gasto donde el plan lo permita; no todos los avisos son limites duros.

El codigo base de esta guia NO incorpora Redis ni un CAPTCHA, y no pretende ser resistente a un ataque dedicado. No publiques una API de escritura pensando que Origin es una autenticacion.

## 19. Privacidad, mantenimiento y copias

- Explica en tu politica de privacidad que registras clics, fecha y categoria responsive, para que los usas, durante cuanto tiempo los conservas y que proveedores intervienen.
- No usar cookies de tracking NO garantiza que no sea necesario consentimiento. Revisa la normativa aplicable, RGPD/LSSI y criterios de la AEPD. Si necesitas consentimiento, activa el tracker solo despues de obtenerlo y respeta su retirada.
- Las cookies de Supabase de esta implementacion son para TU autenticacion; el tracker no crea una sesion de visitante.
- Aunque esta tabla no guarda IP, Vercel y Supabase pueden tratar datos tecnicos en sus registros e infraestructura. Revisa acuerdos de tratamiento, regiones y transferencias.
- Elige una retencion, por ejemplo 90 dias. Si decides aplicar esa retencion, ejecuta periodicamente desde un mecanismo administrativo fiable:

```sql
delete from public.analytics_events
where created_at < now() - interval '90 days';
```

- El borrado anterior es intencionalmente destructivo. Exporta primero si necesitas conservar el historial. Puedes automatizarlo con Supabase Cron cuando lo configures; no se automatiza con los bloques anteriores.
- Descarga periodicamente el historial. `log.txt` es una exportacion de eventos, no un backup completo de usuarios, politicas o esquema; revisa tambien las opciones de backup de Supabase.
- Si filtras la clave secreta, corrige el punto de fuga, crea otra, actualizala en los entornos, redespliega y revoca la anterior.
- No se registran visitas, tiempo de permanencia, sesiones ni usuarios unicos. Para eso se necesitaria ampliar el modelo y revisar sus implicaciones de privacidad.
- Los bloqueadores, JavaScript deshabilitado, errores de red y limites de Beacon pueden perder eventos. Un clic registrado no garantiza que el destino haya cargado.

## 20. Problemas habituales

| Sintoma | Comprobacion |
| --- | --- |
| POST 403 | Origin exacto, puerto, dominio canonico y variable sin barra final. |
| POST 400 | Identificador en la lista y device igual a mobile o desktop. |
| POST 503 | Variables del servidor, clave secreta, tabla, grants, proyecto activo y logs sin secretos. |
| Tabla vacia tras login | UUID de politica y variable iguales al usuario autenticado; entorno Supabase correcto. |
| Permiso denegado al consultar | Grant SELECT para authenticated y politica RLS correcta. |
| Sesion se pierde al expirar | proxy.ts en la raiz, matcher correcto, cookies renovadas devueltas y no cacheadas. |
| Funciona local pero no desplegado | Variables de Production, nuevo despliegue, origen HTTPS y disponibilidad de Supabase. |
| No se ve la peticion | Tracker montado en Home, flag true durante build y atributo en el enlace real. |
| Solo exporta un fragmento | Error durante streaming, limites de funcion o API configurada por debajo del lote de 500. |

Mantiene el limite de filas de la Data API de Supabase al menos en 500 (el valor habitual es 1000), ya que el exportador usa lotes de 500. No aumentes ese limite para intentar cargar todo el historial en una sola consulta.

## Referencias

- Supabase con Next.js SSR: https://supabase.com/docs/guides/auth/server-side/nextjs
- Claves y permisos: https://supabase.com/docs/guides/api/api-keys
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Login por contrasena: https://supabase.com/docs/guides/auth/passwords
- Limites de Vercel: https://vercel.com/docs/functions/limitations
- Firewall: https://vercel.com/docs/vercel-firewall

La guia se ha contrastado con la documentacion local de Next.js 16.4 y la documentacion publicada de Supabase. Los bloques no se han compilado ni ejecutado como aplicacion; las pruebas del paso 16 son obligatorias al implementarlos.