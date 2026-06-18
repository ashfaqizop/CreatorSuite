// =============================================================================
// CreatorSuite — shared types (§12)
// =============================================================================

/** The 13 launch niches (§8.1). Expandable via admin. */
export const NICHES = [
  "finance",
  "tech",
  "lifestyle",
  "gaming",
  "beauty-fashion",
  "food-cooking",
  "fitness-health",
  "education",
  "travel",
  "sports",
  "diy-crafts",
  "parenting",
  "business",
] as const;

export type NicheSlug = (typeof NICHES)[number];

export const NICHE_LABELS: Record<NicheSlug, string> = {
  finance: "Finance",
  tech: "Tech",
  lifestyle: "Lifestyle",
  gaming: "Gaming",
  "beauty-fashion": "Beauty & Fashion",
  "food-cooking": "Food & Cooking",
  "fitness-health": "Fitness & Health",
  education: "Education",
  travel: "Travel",
  sports: "Sports",
  "diy-crafts": "DIY & Crafts",
  parenting: "Parenting",
  business: "Business & Entrepreneurship",
};

export type CategorySlug =
  | "brand-deals"
  | "ad-revenue"
  | "audience-funnels"
  | "business-ops"
  | "content-production";

/** Low / mid / high benchmark range. */
export interface Range {
  low: number;
  mid: number;
  high: number;
}

/** Tool registry metadata. */
export interface ToolMeta {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  enabled: boolean;
}

/** A persisted estimate (§10.3). */
export interface Estimate {
  id: string;
  user_id: string;
  tool_slug: string;
  inputs_json: Record<string, unknown>;
  results_json: Record<string, unknown>;
  created_at: string;
}

/** Saved rate card (§10.3). */
export interface RateCard {
  user_id: string;
  pinned_estimate_ids: string[];
  updated_at: string;
}

/** Structured report payload — drives both the result summary and the PDF (§9). */
export interface ReportSection {
  heading: string;
  rows: Array<{ label: string; value: string; accent?: boolean }>;
}

export interface ToolReport {
  toolName: string;
  headline: { label: string; value: string };
  sections: ReportSection[];
  notes?: string[];
}
