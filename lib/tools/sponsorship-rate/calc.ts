import { z } from "zod";
import type { NicheSlug, ToolMeta, ToolReport } from "@/types";
import { NICHE_LABELS } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "sponsorship-rate",
  name: "Sponsorship Rate Estimator",
  category: "brand-deals",
  description:
    "Calculate a flat-fee sponsorship rate from your channel performance and niche.",
  enabled: true,
};

export const PLATFORMS = ["youtube", "tiktok", "instagram", "multi"] as const;
export type Platform = (typeof PLATFORMS)[number];
export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  multi: "Multi-platform",
};

export const DELIVERABLES = [
  "dedicated",
  "integration",
  "story",
  "reel",
  "post",
] as const;
export type Deliverable = (typeof DELIVERABLES)[number];
export const DELIVERABLE_LABELS: Record<Deliverable, string> = {
  dedicated: "Dedicated video",
  integration: "Integration",
  story: "Story",
  reel: "Reel / Short",
  post: "Post",
};
// Deliverable multipliers (§5.1).
const DELIVERABLE_MULT: Record<Deliverable, number> = {
  dedicated: 1.5,
  integration: 1,
  story: 0.4,
  reel: 0.6,
  post: 0.5,
};

export const schema = z.object({
  monthlyViews: z.number().min(0),
  engagementRate: z.number().min(0).max(100),
  niche: z.string(),
  platform: z.enum(PLATFORMS),
  deliverable: z.enum(DELIVERABLES),
});
export type Inputs = z.infer<typeof schema> & { niche: NicheSlug };

export const defaultInputs: Inputs = {
  monthlyViews: 50000,
  engagementRate: 4,
  niche: "tech",
  platform: "youtube",
  deliverable: "dedicated",
};

export interface Result {
  low: number;
  mid: number;
  high: number;
  cpmFactor: number;
  nicheAvgEngagement: number;
  engagementMultiplier: number;
  deliverableMultiplier: number;
  aboveAverage: boolean;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const cpmFactor = bench.sponsorshipCpm[inputs.niche] ?? 18;
  const avgEng = bench.engagement[inputs.niche] ?? 3;

  const base = (inputs.monthlyViews * cpmFactor) / 1000;

  // Engagement multiplier applied only if above niche average (§5.1).
  const aboveAverage = inputs.engagementRate > avgEng;
  const engagementMultiplier = aboveAverage
    ? 1 + Math.min(0.5, ((inputs.engagementRate - avgEng) / avgEng) * 0.5)
    : 1;

  const deliverableMultiplier = DELIVERABLE_MULT[inputs.deliverable];

  const mid = base * engagementMultiplier * deliverableMultiplier;
  return {
    low: mid * 0.75,
    mid,
    high: mid * 1.3,
    cpmFactor,
    nicheAvgEngagement: avgEng,
    engagementMultiplier,
    deliverableMultiplier,
    aboveAverage,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Suggested flat fee (mid)", value: usd(r.mid) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Monthly avg views", value: num(inputs.monthlyViews) },
          { label: "Engagement rate", value: pct(inputs.engagementRate) },
          { label: "Niche", value: NICHE_LABELS[inputs.niche] },
          { label: "Platform", value: PLATFORM_LABELS[inputs.platform] },
          { label: "Deliverable", value: DELIVERABLE_LABELS[inputs.deliverable] },
        ],
      },
      {
        heading: "Suggested fee range",
        rows: [
          { label: "Low", value: usd(r.low) },
          { label: "Mid", value: usd(r.mid), accent: true },
          { label: "High", value: usd(r.high) },
        ],
      },
      {
        heading: "Benchmark comparison",
        rows: [
          { label: "Niche CPM factor", value: usd(r.cpmFactor) + " / 1k" },
          { label: "Niche avg engagement", value: pct(r.nicheAvgEngagement) },
          {
            label: "Your engagement vs niche",
            value: r.aboveAverage ? "Above average" : "At / below average",
            accent: r.aboveAverage,
          },
        ],
      },
    ],
    notes: [
      "Deliverable multiplier: Dedicated 1.5×, Integration 1×, Reel/Short 0.6×, Post 0.5×, Story 0.4×.",
    ],
  };
}
