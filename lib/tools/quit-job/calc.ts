import { z } from "zod";
import type { NicheSlug, ToolMeta, ToolReport } from "@/types";
import { NICHE_LABELS } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { usd, num } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "quit-job",
  name: 'Creator "Quit Your Job" Milestone Tracker',
  category: "business-ops",
  description:
    "Reverse-engineer a target survival income into the platform metrics you need.",
  enabled: true,
};

export const SOURCES = [
  "youtube-adsense",
  "sponsorships",
  "ugc",
  "memberships",
  "digital-products",
  "affiliate",
] as const;
export type Source = (typeof SOURCES)[number];
export const SOURCE_LABELS: Record<Source, string> = {
  "youtube-adsense": "YouTube AdSense",
  sponsorships: "Sponsorships",
  ugc: "UGC",
  memberships: "Memberships",
  "digital-products": "Digital Products",
  affiliate: "Affiliate",
};

// Per-source assumptions used to reverse-calc the required metric (§5.6).
const MEMBERSHIP_AVG_PRICE = 7; // avg net $/member/month
const PRODUCT_AVG_PRICE = 49; // avg $/sale
const AFFILIATE_AVG_COMMISSION = 15; // avg $/conversion

export const schema = z.object({
  monthlyTarget: z.number().min(0),
  niche: z.string(),
  // percentage contribution per enabled source (0 = disabled)
  allocations: z.record(z.enum(SOURCES), z.number().min(0).max(100)),
  currentIncome: z.number().min(0),
});
export type Inputs = z.infer<typeof schema> & { niche: NicheSlug };

export const defaultInputs: Inputs = {
  monthlyTarget: 4000,
  niche: "tech",
  allocations: {
    "youtube-adsense": 40,
    sponsorships: 30,
    ugc: 0,
    memberships: 15,
    "digital-products": 15,
    affiliate: 0,
  },
  currentIncome: 0,
};

export interface SourcePlan {
  source: Source;
  pct: number;
  income: number;
  metricLabel: string;
  metricValue: number;
}

export interface Result {
  totalPct: number;
  plans: SourcePlan[];
  gap: number;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const totalPct = SOURCES.reduce(
    (sum, s) => sum + (inputs.allocations[s] ?? 0),
    0,
  );
  const rpm = bench.cpmRpm[inputs.niche]?.mid ?? 6;
  const sponsorCpm = bench.sponsorshipCpm[inputs.niche] ?? 18;
  const ugcRate = bench.ugcRates["whitelist-30"]?.mid ?? 400;

  const plans: SourcePlan[] = SOURCES.filter(
    (s) => (inputs.allocations[s] ?? 0) > 0,
  ).map((source) => {
    const pct = inputs.allocations[source] ?? 0;
    const income = inputs.monthlyTarget * (pct / 100);
    let metricLabel = "";
    let metricValue = 0;
    switch (source) {
      case "youtube-adsense":
        metricLabel = "views / month";
        metricValue = (income / rpm) * 1000;
        break;
      case "sponsorships":
        // dedicated-deal pricing: cpm × 1.5 deliverable multiplier
        metricLabel = "sponsored views / month";
        metricValue = (income / (sponsorCpm * 1.5)) * 1000;
        break;
      case "ugc":
        metricLabel = "UGC videos / month";
        metricValue = income / ugcRate;
        break;
      case "memberships":
        metricLabel = "paying members";
        metricValue = income / MEMBERSHIP_AVG_PRICE;
        break;
      case "digital-products":
        metricLabel = "sales / month";
        metricValue = income / PRODUCT_AVG_PRICE;
        break;
      case "affiliate":
        metricLabel = "conversions / month";
        metricValue = income / AFFILIATE_AVG_COMMISSION;
        break;
    }
    return { source, pct, income, metricLabel, metricValue };
  });

  return {
    totalPct,
    plans,
    gap: Math.max(0, inputs.monthlyTarget - inputs.currentIncome),
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Monthly survival target", value: usd(inputs.monthlyTarget) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Niche", value: NICHE_LABELS[inputs.niche] },
          { label: "Current monthly income", value: usd(inputs.currentIncome) },
          { label: "Remaining gap", value: usd(r.gap), accent: r.gap > 0 },
          {
            label: "Allocation total",
            value: `${r.totalPct}%`,
            accent: r.totalPct !== 100,
          },
        ],
      },
      {
        heading: "Per-source requirements",
        rows: r.plans.map((p) => ({
          label: `${SOURCE_LABELS[p.source]} (${p.pct}% · ${usd(p.income)})`,
          value: `${num(Math.ceil(p.metricValue))} ${p.metricLabel}`,
          accent: true,
        })),
      },
    ],
    notes:
      r.totalPct !== 100
        ? ["Allocations do not sum to 100% — adjust for an accurate plan."]
        : undefined,
  };
}
