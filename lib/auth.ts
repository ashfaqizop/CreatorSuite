import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/config";

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const providers = [];
if (GOOGLE_ID && GOOGLE_SECRET) {
  providers.push(
    Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
  );
}

// Use the Supabase adapter (DB sessions) only when service creds exist;
// otherwise fall back to stateless JWT sessions so the app still runs.
const adapter = isSupabaseAdminConfigured
  ? SupabaseAdapter({
      url: SUPABASE_URL!,
      secret: SUPABASE_SERVICE_KEY!,
    })
  : undefined;

export const authConfig: NextAuthConfig = {
  providers,
  adapter,
  session: { strategy: adapter ? "database" : "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {},
  callbacks: {
    async session({ session, user }) {
      if (session.user && user?.id) session.user.id = user.id;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/** Comma-separated owner emails — primary admin gate (§7). */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}
