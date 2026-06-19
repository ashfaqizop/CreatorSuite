import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES, getGuide } from "@/lib/guides";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide not found — CreatorSuite" };
  return { title: `${guide.title} — CreatorSuite`, description: guide.description };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="flex flex-col gap-8 max-w-[720px]">
      <header className="flex flex-col gap-3">
        <Link
          href="/guides"
          className="font-mono text-cs-12 uppercase text-cs-fg-muted hover:text-cs-accent"
        >
          ← All guides
        </Link>
        <span className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-dim">
          {guide.readMinutes} min read
        </span>
        <h1 className="font-display text-cs-32 leading-tight">{guide.title}</h1>
        <p className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
          {guide.description}
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {guide.sections.map((section, i) => (
          <section key={i} className="flex flex-col gap-3">
            <h2 className="cs-dot font-display text-cs-16 uppercase tracking-wide flex items-center">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, j) => (
              <p key={j} className="font-mono text-cs-16 text-cs-fg-muted leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      {guide.relatedTool ? (
        <div className="bg-cs-surface border border-cs-border p-6 flex flex-col gap-3">
          <span className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted">
            Run the numbers
          </span>
          <h3 className="font-display text-cs-16">{guide.relatedTool.name}</h3>
          <div>
            <Link href={`/tools/${guide.relatedTool.slug}`}>
              <Button>Open the tool</Button>
            </Link>
          </div>
        </div>
      ) : null}

      <p className="font-mono text-cs-12 text-cs-fg-dim leading-relaxed border-t border-cs-border pt-4">
        This article is for general educational purposes and reflects typical
        creator-economy ranges. All figures are estimates, not financial advice.
      </p>
    </article>
  );
}
