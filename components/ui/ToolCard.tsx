import Link from "next/link";

/** Tool grid card — bordered, sharp, hover = red border (§4.4). */
export function ToolCard({
  slug,
  name,
  description,
  category,
}: {
  slug: string;
  name: string;
  description: string;
  category: string;
}) {
  return (
    <Link
      href={`/tools/${slug}`}
      className="group bg-cs-surface border border-cs-border p-5 flex flex-col gap-3 hover:border-cs-accent transition-none min-h-[160px]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted border border-cs-border px-2 py-1 group-hover:border-cs-accent group-hover:text-cs-accent">
          {category}
        </span>
        <span className="w-2 h-2 bg-cs-fg-dim group-hover:bg-cs-accent" />
      </div>
      <h3 className="font-display text-cs-16 leading-snug">{name}</h3>
      <p className="font-mono text-cs-12 text-cs-fg-muted leading-relaxed mt-auto">
        {description}
      </p>
    </Link>
  );
}
