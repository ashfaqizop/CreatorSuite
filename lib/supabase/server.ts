import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  isSupabaseAdminConfigured,
} from "./config";

/**
 * Server-side Supabase client using the service role key (server-only, §12).
 * Returns null when Supabase is not configured so callers can fall back.
 */
export function getServerSupabase(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured) return null;
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
