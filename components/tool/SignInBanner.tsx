"use client";

import { useSession, signIn } from "next-auth/react";

/** Non-intrusive muted banner shown after first Calculate (§10.1) — not a modal. */
export function SignInBanner() {
  const { data: session, status } = useSession();
  if (status === "loading" || session?.user) return null;

  return (
    <div className="border border-cs-border bg-cs-surface px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
      <span className="font-mono text-cs-12 text-cs-fg-muted">
        Sign in to save your history and build a Rate Card.
      </span>
      <button
        onClick={() => signIn("google")}
        className="font-display text-cs-12 uppercase border border-cs-border px-3 py-2 hover:border-cs-accent hover:text-cs-accent cursor-pointer"
      >
        Sign In
      </button>
    </div>
  );
}
