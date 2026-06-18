import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { USAGE_TIER_LABELS, type UsageTier } from "@/lib/benchmarks/seed";
import { usd, num } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "ugc-rate",
  name: "UGC Rate Calculator",
  category: "brand-deals",
  description: "Price raw video assets for brand use by usage rights and platform.",
  enabled: true,
};

export const PLATFORMS = ["tiktok", "meta", "youtube", "all"] as const;
export type UgcPlatform = (typeof PLATFORMS)[number];
export const PLATFORM_LABELS: Record<UgcPlatform, string> = {
  tiktok: "TikTok",
  meta: "Meta",
  youtube: "YouTube",
  all: "All platforms",
};

export const REVISIONS = ["0", "1", "2", "unlimited"] as const;
export type Revisions = (typeof REVISIONS)[number];

export const schema = z.object({
  deliverables: z.number().min(1),
  usageTier: z.string(),
  platforms: z.array(z.enum(PLATFORMS)),
  revisions: z.enum(REVISIONS),
  exclusivity: z.boolean(),
});
export type Inputs = z.infer<typeof schema> & { usageTier: UsageTier };

export const defaultInputs: Inputs = {
  deliverables: 3,
  usageTier: "whitelist-30",
  platforms: ["tiktok"],
  revisions: "1",
  exclusivity: false,
};

function revisionMultiplier(r: Revisions): number {
  if (r === "unlimited") return 1.4; // capped (§5.3)
  return 1 + Number(r) * 0.1;
}

function isMultiPlatform(platforms: UgcPlatform[]): boolean {
  return platforms.includes("all") || platforms.length > 1;
}

export interface Result {
  perVideo: number;
  perVideoLow: number;
  perVideoHigh: number;
  packageRate: number;
  platformMult: number;
  revisionMult: number;
  exclusivityMult: number;
  baseMid: number;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const range = bench.ugcRates[inputs.usageTier] ?? { low: 150, mid: 250, high: 400 };
  const platformMult = isMultiPlatform(inputs.platforms) ? 1.2 : 1; // +20%
  const revisionMult = revisionMultiplier(inputs.revisions);
  const exclusivityMult = inputs.exclusivity ? 1.25 : 1; // +25%
  const combined = platformMult * revisionMult * exclusivityMult;

  const perVideo = range.mid * combined;
  return {
    perVideo,
    perVideoLow: range.low * combined,
    perVideoHigh: range.high * combined,
    packageRate: perVideo * inputs.deliverables,
    platformMult,
    revisionMult,
    exclusivityMult,
    baseMid: range.mid,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Package rate", value: usd(r.packageRate) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Deliverables", value: num(inputs.deliverables) },
          { label: "Usage rights", value: USAGE_TIER_LABELS[inputs.usageTier] },
          {
            label: "Platforms",
            value: inputs.platforms.map((p) => PLATFORM_LABELS[p]).join(", ") || "—",
          },
          { label: "Revision rounds", value: inputs.revisions },
          { label: "Exclusivity", value: inputs.exclusivity ? "Yes (+25%)" : "No" },
        ],
      },
      {
        heading: "Rate per video",
        rows: [
          { label: "Low", value: usd(r.perVideoLow) },
          { label: "Rate per video", value: usd(r.perVideo), accent: true },
          { label: "High", value: usd(r.perVideoHigh) },
        ],
      },
      {
        heading: "Multipliers applied",
        rows: [
          { label: "Base (usage tier mid)", value: usd(r.baseMid) },
          { label: "Platform", value: `×${r.platformMult.toFixed(2)}` },
          { label: "Revisions", value: `×${r.revisionMult.toFixed(2)}` },
          { label: "Exclusivity", value: `×${r.exclusivityMult.toFixed(2)}` },
          { label: "Package rate", value: usd(r.packageRate), accent: true },
        ],
      },
    ],
  };
}
