import { z } from "zod";
import type { NicheSlug, ToolMeta, ToolReport } from "@/types";
import { NICHE_LABELS } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "youtube-rpm",
  name: "YouTube AdSense & RPM Predictor",
  category: "ad-revenue",
  description:
    "Simulate monthly AdSense revenue from views, video length, and geography.",
  enabled: true,
};

export const schema = z.object({
  monthlyViews: z.number().min(0),
  longForm: z.boolean(), // true = over 8 min (mid-rolls enabled)
  usTrafficPct: z.number().min(0).max(100),
  niche: z.string(),
});
export type Inputs = z.infer<typeof schema> & { niche: NicheSlug };

export const defaultInputs: Inputs = {
  monthlyViews: 200000,
  longForm: true,
  usTrafficPct: 40,
  niche: "tech",
};

export interface Result {
  blendedRpm: number;
  rpmWithMidroll: number;
  geoWeight: number;
  revenue: number;
  revenueLow: number;
  revenueHigh: number;
  midrollUplift: number;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const rpm = bench.cpmRpm[inputs.niche] ?? { low: 3, mid: 6, high: 10 };
  const usFrac = inputs.usTrafficPct / 100;
  const rowFrac = 1 - usFrac;
  const geoWeight = usFrac * bench.usPremiumFactor + rowFrac; // §5.2

  const blendedRpm = rpm.mid * geoWeight;
  const midrollMult = inputs.longForm ? 1.4 : 1; // +40% mid-roll bonus (§5.2)
  const rpmWithMidroll = blendedRpm * midrollMult;

  const k = inputs.monthlyViews / 1000;
  const revenue = k * rpmWithMidroll;
  const midrollUplift = revenue - k * blendedRpm;

  return {
    blendedRpm,
    rpmWithMidroll,
    geoWeight,
    revenue,
    revenueLow: k * rpm.low * geoWeight * midrollMult,
    revenueHigh: k * rpm.high * geoWeight * midrollMult,
    midrollUplift,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Estimated monthly revenue", value: usd(r.revenue) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Monthly video views", value: num(inputs.monthlyViews) },
          { label: "Video length", value: inputs.longForm ? "Over 8 min (mid-roll)" : "Under 8 min" },
          { label: "US traffic", value: pct(inputs.usTrafficPct, 0) },
          { label: "Niche", value: NICHE_LABELS[inputs.niche] },
        ],
      },
      {
        heading: "Revenue",
        rows: [
          { label: "Low estimate", value: usd(r.revenueLow) },
          { label: "Estimate", value: usd(r.revenue), accent: true },
          { label: "High estimate", value: usd(r.revenueHigh) },
        ],
      },
      {
        heading: "RPM detail",
        rows: [
          { label: "Blended RPM (geo)", value: usd(r.blendedRpm, true) },
          { label: "RPM used (with mid-roll)", value: usd(r.rpmWithMidroll, true), accent: true },
          { label: "Mid-roll uplift", value: usd(r.midrollUplift) },
        ],
      },
    ],
    notes: ["Mid-roll bonus applies +40% RPM for videos over 8 minutes."],
  };
}
