"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { getAnalyticsSession } from "@/lib/analytics-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteAllEvents() {
  if (!await getAnalyticsSession()) redirect("/analytics/login");

  try {
    const { error } = await createAdminClient()
      .from("analytics_events")
      .delete()
      .not("id", "is", null);
    if (error) return { error: "No se pudieron borrar los registros. Intentalo de nuevo." };
  } catch {
    return { error: "No se pudieron borrar los registros. Intentalo de nuevo." };
  }

  redirect("/analytics");
}

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || email.length > 254 ||
      typeof password !== "string" || !password || password.length > 1024) {
    redirect("/analytics/login?error=1");
  }
  const supabase = await createSessionClient(true);
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
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