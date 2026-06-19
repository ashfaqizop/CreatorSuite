import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides — CreatorSuite",
  description:
    "Practical guides on pricing sponsorships, understanding RPM, UGC rates, and diversifying creator income.",
};

export default function GuidesPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[820px]">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-cs-12 uppercase tracking-widest text-cs-accent">
          Guides
        </span>
        <h1 className="font-display text-cs-32 leading-tight">
          Creator monetization, explained
        </h1>
        <p className="font-mono text-cs-16 text-cs-fg-muted">
          Plain-language guides to the numbers behind creator income. Each one
          pairs with a free tool to run your own estimate.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group bg-cs-surface border border-cs-border p-5 flex flex-col gap-3 hover:border-cs-accent min-h-[150px]"
          >
            <span className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted">
              {g.readMinutes} min read
            </span>
            <h2 className="font-display text-cs-16 leading-snug group-hover:text-cs-fg">
              {g.title}
            </h2>
            <p className="font-mono text-cs-12 text-cs-fg-muted leading-relaxed mt-auto">
              {g.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
