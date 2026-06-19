/** Canonical site origin (no trailing slash). Override via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://creator-suite-sigma.vercel.app";
