import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolMeta } from "@/lib/tools";
import { getToolMetasWithSettings } from "@/lib/tools/settings";
import { getBenchmarks } from "@/lib/benchmarks/getBenchmarks";
import { ToolHost } from "@/components/tool/ToolHost";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getToolMeta(slug);
  if (!meta) return { title: "Tool not found — CreatorSuite" };
  return { title: `${meta.name} — CreatorSuite`, description: meta.description };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const metas = await getToolMetasWithSettings();
  const meta = metas.find((m) => m.slug === slug);

  // Unknown or disabled tool → 404 (§7 tool toggle).
  if (!meta || !meta.enabled) notFound();

  const bench = await getBenchmarks();
  return <ToolHost slug={slug} bench={bench} />;
}
