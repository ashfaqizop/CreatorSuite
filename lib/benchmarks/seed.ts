import type { NicheSlug, Range } from "@/types";

// =============================================================================
// Benchmark seed data (§8.3) — realistic mid-2025 creator-economy reference
// ranges. This is the single source of truth: the Supabase migration is
// generated from it, and getBenchmarks() falls back to it when Supabase is
// not configured. Editable in-app via /admin once Supabase is wired.
// =============================================================================

export const BENCHMARKS_LAST_UPDATED = "2025-06-01";

/** YouTube ad RPM ranges (USD per 1000 views) by niche (§8.2 benchmarks_cpm). */
export const CPM_RPM: Record<NicheSlug, Range> = {
  finance: { low: 12, mid: 22, high: 35 },
  tech: { low: 6, mid: 12, high: 20 },
  lifestyle: { low: 3, mid: 6, high: 10 },
  gaming: { low: 2, mid: 4, high: 7 },
  "beauty-fashion": { low: 4, mid: 8, high: 14 },
  "food-cooking": { low: 4, mid: 8, high: 13 },
  "fitness-health": { low: 5, mid: 9, high: 15 },
  education: { low: 6, mid: 11, high: 18 },
  travel: { low: 4, mid: 8, high: 13 },
  sports: { low: 3, mid: 6, high: 10 },
  "diy-crafts": { low: 3, mid: 6, high: 10 },
  parenting: { low: 5, mid: 9, high: 14 },
  business: { low: 10, mid: 18, high: 30 },
};

/** Average engagement rate (%) by niche (§8.2 benchmarks_engagement). */
export const ENGAGEMENT: Record<NicheSlug, number> = {
  finance: 2.5,
  tech: 2.0,
  lifestyle: 3.5,
  gaming: 4.0,
  "beauty-fashion": 3.2,
  "food-cooking": 3.8,
  "fitness-health": 3.5,
  education: 2.8,
  travel: 3.6,
  sports: 3.0,
  "diy-crafts": 4.2,
  parenting: 3.4,
  business: 2.2,
};

/** Flat-fee sponsorship CPM factor (effective USD per 1000 views) by niche
 *  (§8.2 benchmarks_sponsorship). Higher than ad RPM — reflects deal pricing. */
export const SPONSORSHIP_CPM: Record<NicheSlug, number> = {
  finance: 30,
  tech: 25,
  lifestyle: 18,
  gaming: 14,
  "beauty-fashion": 22,
  "food-cooking": 18,
  "fitness-health": 20,
  education: 20,
  travel: 18,
  sports: 16,
  "diy-crafts": 15,
  parenting: 18,
  business: 28,
};

/** Sales-page conversion + checkout abandon ranges by product type
 *  (§8.2 benchmarks_conversion). Values are percentages. */
export type ProductType = "ebook" | "mini-course" | "full-course" | "workshop";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  ebook: "E-book",
  "mini-course": "Mini-course",
  "full-course": "Full course",
  workshop: "Workshop",
};

export const CONVERSION: Record<
  ProductType,
  { conversion: Range; abandon: Range }
> = {
  ebook: { conversion: { low: 1, mid: 2, high: 4 }, abandon: { low: 60, mid: 70, high: 80 } },
  "mini-course": { conversion: { low: 1, mid: 2.5, high: 5 }, abandon: { low: 55, mid: 65, high: 75 } },
  "full-course": { conversion: { low: 0.5, mid: 1.5, high: 3 }, abandon: { low: 50, mid: 60, high: 70 } },
  workshop: { conversion: { low: 1.5, mid: 3, high: 6 }, abandon: { low: 45, mid: 55, high: 65 } },
};

/** UGC base per-video rate ranges (USD) by usage tier (§8.2 benchmarks_ugc). */
export type UsageTier =
  | "organic"
  | "whitelist-30"
  | "whitelist-90"
  | "whitelist-12mo"
  | "buyout";

export const USAGE_TIER_LABELS: Record<UsageTier, string> = {
  organic: "Organic only",
  "whitelist-30": "30-day whitelist",
  "whitelist-90": "90-day whitelist",
  "whitelist-12mo": "12-month whitelist",
  buyout: "Full buyout",
};

export const UGC_RATES: Record<UsageTier, Range> = {
  organic: { low: 150, mid: 250, high: 400 },
  "whitelist-30": { low: 250, mid: 400, high: 600 },
  "whitelist-90": { low: 350, mid: 550, high: 850 },
  "whitelist-12mo": { low: 500, mid: 800, high: 1200 },
  buyout: { low: 800, mid: 1400, high: 2500 },
};

/** Platform fee percentages (§8.2 benchmarks_platform_fees). */
export type MembershipPlatform =
  | "patreon"
  | "youtube-memberships"
  | "substack"
  | "other";

export const PLATFORM_LABELS: Record<MembershipPlatform, string> = {
  patreon: "Patreon",
  "youtube-memberships": "YouTube Memberships",
  substack: "Substack",
  other: "Other",
};

export const PLATFORM_FEES: Record<MembershipPlatform, number> = {
  patreon: 8,
  "youtube-memberships": 30,
  substack: 10,
  other: 5,
};

/** AI tool monthly subscription presets (§5.7), editable per row by the user. */
export const AI_TOOL_PRESETS: { id: string; name: string; cost: number }[] = [
  { id: "chatgpt-plus", name: "ChatGPT Plus", cost: 20 },
  { id: "claude-pro", name: "Claude Pro", cost: 20 },
  { id: "gemini", name: "Gemini Advanced", cost: 20 },
  { id: "midjourney", name: "Midjourney", cost: 30 },
  { id: "elevenlabs", name: "ElevenLabs", cost: 22 },
  { id: "runway", name: "Runway", cost: 35 },
];

/** US premium multiplier applied to RPM for US traffic share (§5.2). */
export const US_PREMIUM_FACTOR = 1.6;

/** The complete benchmark bundle returned to the client. */
export interface BenchmarkBundle {
  lastUpdated: string;
  cpmRpm: Record<NicheSlug, Range>;
  engagement: Record<NicheSlug, number>;
  sponsorshipCpm: Record<NicheSlug, number>;
  conversion: Record<ProductType, { conversion: Range; abandon: Range }>;
  ugcRates: Record<UsageTier, Range>;
  platformFees: Record<MembershipPlatform, number>;
  usPremiumFactor: number;
}

export const SEED_BUNDLE: BenchmarkBundle = {
  lastUpdated: BENCHMARKS_LAST_UPDATED,
  cpmRpm: CPM_RPM,
  engagement: ENGAGEMENT,
  sponsorshipCpm: SPONSORSHIP_CPM,
  conversion: CONVERSION,
  ugcRates: UGC_RATES,
  platformFees: PLATFORM_FEES,
  usPremiumFactor: US_PREMIUM_FACTOR,
};
