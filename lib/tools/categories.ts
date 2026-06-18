import type { CategorySlug } from "@/types";

export const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: "brand-deals", label: "Brand Deals" },
  { slug: "ad-revenue", label: "Ad Revenue" },
  { slug: "audience-funnels", label: "Audience Funnels" },
  { slug: "business-ops", label: "Business Ops" },
  { slug: "content-production", label: "Content Production" },
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.label]),
) as Record<CategorySlug, string>;
