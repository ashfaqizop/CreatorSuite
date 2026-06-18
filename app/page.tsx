import { getEnabledToolMetas } from "@/lib/tools/settings";
import { CATEGORIES } from "@/lib/tools/categories";
import { ToolCard } from "@/components/ui/ToolCard";

export default async function Home() {
  const metas = await getEnabledToolMetas();

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-cs-accent" />
          <span className="font-mono text-cs-12 uppercase tracking-widest text-cs-fg-muted">
            Creator Monetization Suite
          </span>
        </div>
        <h1 className="font-display text-cs-32 md:text-cs-48 leading-tight">
          Calculate. Predict. Optimize.
        </h1>
        <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
          Specialized micro-tools for creator business income. Enter your real
          stats — we enrich with curated niche benchmarks. Estimates only, not
          financial advice.
        </p>
      </section>

      {CATEGORIES.map((cat) => {
        const tools = metas.filter((m) => m.category === cat.slug);
        if (tools.length === 0) return null;
        return (
          <section key={cat.slug} id={cat.slug} className="flex flex-col gap-4 scroll-mt-20">
            <h2 className="cs-dot font-display text-cs-16 uppercase tracking-wider flex items-center">
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tools.map((t) => (
                <ToolCard
                  key={t.slug}
                  slug={t.slug}
                  name={t.name}
                  description={t.description}
                  category={cat.label}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
