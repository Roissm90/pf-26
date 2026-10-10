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