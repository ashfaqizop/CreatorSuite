"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CATEGORIES } from "@/lib/tools/categories";
import { cn } from "@/lib/utils";

function AuthButton({ mobile = false }: { mobile?: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="font-mono text-cs-12 text-cs-fg-dim">…</span>
    );
  }

  if (session?.user) {
    return (
      <div className={cn("flex items-center gap-3", mobile && "flex-col items-start")}>
        <Link
          href="/history"
          className="font-mono text-cs-12 uppercase text-cs-fg-muted hover:text-cs-accent"
        >
          History
        </Link>
        <Link
          href="/rate-card"
          className="font-mono text-cs-12 uppercase text-cs-fg-muted hover:text-cs-accent"
        >
          Rate Card
        </Link>
        <button
          onClick={() => signOut()}
          className="font-display text-cs-12 uppercase border border-cs-border px-3 py-2 hover:border-cs-accent cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="font-display text-cs-12 uppercase border border-cs-fg px-3 py-2 hover:border-cs-accent hover:text-cs-accent cursor-pointer"
    >
      Sign In
    </button>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-cs-border bg-cs-bg/95 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-3 h-3 bg-cs-accent" />
          <span className="font-display text-cs-16 uppercase tracking-wider">
            CreatorSuite
          </span>
        </Link>

        {/* Desktop category links */}
        <nav className="hidden md:flex items-center gap-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/#${c.slug}`}
              className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted hover:text-cs-fg"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/guides"
            className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted hover:text-cs-fg"
          >
            Guides
          </Link>
        </nav>

        <div className="hidden md:block">
          <AuthButton />
        </div>

        {/* Mobile hamburger (§11) */}
        <button
          className="md:hidden font-display text-cs-16 w-11 h-11 flex items-center justify-center border border-cs-border cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? "✕" : "≡"}
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-cs-border px-4 py-4 flex flex-col gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/#${c.slug}`}
              onClick={() => setOpen(false)}
              className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/guides"
            onClick={() => setOpen(false)}
            className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted"
          >
            Guides
          </Link>
          <AuthButton mobile />
        </div>
      ) : null}
    </header>
  );
}
