import "server-only";
import { auth, isAdminEmail } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * Admin gate (§7). Owner email(s) via ADMIN_EMAILS env are always admin; also
 * honours a `role = 'admin'` row in the `app_roles` table when Supabase exists.
 */
export async function getIsAdmin(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return false;
  if (isAdminEmail(email)) return true;

  const supabase = getServerSupabase();
  if (!supabase) return false;
  try {
    const { data } = await supabase
      .from("app_roles")
      .select("role")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    return data?.role === "admin";
  } catch {
    return false;
  }
}
