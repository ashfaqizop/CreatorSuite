export const metadata = { title: "About — CreatorSuite" };

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4 max-w-[680px]">
      <h1 className="font-display text-cs-32">About CreatorSuite</h1>
      <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
        CreatorSuite is an all-in-one creator monetization suite: specialized
        micro-tools for calculating, predicting, and optimizing creator business
        income. You enter your real stats; we enrich them with curated benchmark
        ranges per niche.
      </p>
      <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
        Every figure is an estimate based on industry reference ranges and your
        inputs — not financial advice. Benchmarks reflect the best available
        creator-economy data at build time and carry a &ldquo;last updated&rdquo;
        date.
      </p>
    </div>
  );
}
