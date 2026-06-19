import type { Metadata } from "next";
import { RELEASES } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog — CreatorSuite",
  description: "Release history and new tools added to CreatorSuite.",
};

export default function ChangelogPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[720px]">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-cs-12 uppercase tracking-widest text-cs-accent">
          Changelog
        </span>
        <h1 className="font-display text-cs-32 leading-tight">What&apos;s new</h1>
        <p className="font-mono text-cs-16 text-cs-fg-muted">
          Every release ships more tools on the road to all 21.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {RELEASES.map((r) => (
          <section
            key={r.version}
            className="bg-cs-surface border border-cs-border p-6 flex flex-col gap-3"
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h2 className="font-display text-cs-24 flex items-center gap-3">
                <span className="w-3 h-3 bg-cs-accent inline-block" />
                {r.version}
              </h2>
              <span className="font-mono text-cs-12 text-cs-fg-dim uppercase">
                {r.date}
              </span>
            </div>
            <p className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted">
              {r.title}
            </p>
            <ul className="flex flex-col gap-2">
              {r.items.map((item, i) => (
                <li
                  key={i}
                  className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed pl-5 relative"
                >
                  <span className="absolute left-0 top-2 w-2 h-2 bg-cs-fg-dim" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
