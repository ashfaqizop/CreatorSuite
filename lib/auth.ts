import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const providers = [];
if (GOOGLE_ID && GOOGLE_SECRET) {
  providers.push(Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }));
}

// JWT sessions (stateless): no database adapter, so no `next_auth` schema to
// expose in Supabase. The stable user id is the Google account id (token.sub);
// estimates + rate cards are stored server-side in public tables keyed by it.
export const authConfig: NextAuthConfig = {
  providers,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
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
