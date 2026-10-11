import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/game") {
    const ticket = request.nextUrl.searchParams.get("entry");
    const cookie = request.cookies.get("game-entry")?.value;
    const response = ticket && cookie && ticket === cookie
      ? NextResponse.next()
      : NextResponse.redirect(new URL(request.nextUrl.searchParams.get("from") === "en" ? "/en" : "/", request.url));
    response.cookies.set("game-entry", "", { path: "/game", maxAge: 0, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/en") {
    const headers = new Headers(request.headers);
    headers.set("x-portfolio-language", request.nextUrl.pathname === "/en" ? "en" : "es");
    return NextResponse.next({ request: { headers } });
  }
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        httpOnly: true, secure: process.env.NODE_ENV === "production",
        sameSite: "lax", path: "/",
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
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

export const config = { matcher: ["/", "/en", "/game", "/analytics/:path*"] };