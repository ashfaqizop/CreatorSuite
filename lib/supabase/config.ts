export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

/** True when public Supabase env is present (client-side capable). */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** True when the server can use the privileged service role. */
export const isSupabaseAdminConfigured = Boolean(
  SUPABASE_URL && SUPABASE_SERVICE_KEY,
);
