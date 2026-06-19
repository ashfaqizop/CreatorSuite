import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "tiktok-rewards",
  name: "TikTok Creator Rewards Estimator",
  category: "ad-revenue",
  description:
    "Estimate TikTok Creator Rewards income from qualified views (videos over 1 minute).",
  enabled: true,
};

export const schema = z.object({
  qualifiedViews: z.number().min(0),
  usTrafficPct: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  qualifiedViews: 1000000,
  usTrafficPct: 30,
};

export interface Result {
  blendedRpm: number;
  geoWeight: number;
  revenue: number;
  revenueLow: number;
  revenueHigh: number;
  annual: number;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const rpm = bench.tiktokRpm;
  const usFrac = inputs.usTrafficPct / 100;
  const geoWeight = usFrac * bench.tiktokUsPremium + (1 - usFrac);
  const k = inputs.qualifiedViews / 1000;
  const blendedRpm = rpm.mid * geoWeight;
  const revenue = k * blendedRpm;
  return {
    blendedRpm,
    geoWeight,
    revenue,
    revenueLow: k * rpm.low * geoWeight,
    revenueHigh: k * rpm.high * geoWeight,
    annual: revenue * 12,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Estimated monthly rewards", value: usd(r.revenue) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Qualified views / month", value: num(inputs.qualifiedViews) },
          { label: "US traffic", value: pct(inputs.usTrafficPct, 0) },
        ],
      },
      {
        heading: "Rewards",
        rows: [
          { label: "Low estimate", value: usd(r.revenueLow) },
          { label: "Estimate", value: usd(r.revenue), accent: true },
          { label: "High estimate", value: usd(r.revenueHigh) },
          { label: "Annual projection", value: usd(r.annual), accent: true },
        ],
      },
      {
        heading: "Detail",
        rows: [
          { label: "Blended RPM (per 1k)", value: usd(r.blendedRpm, true) },
          { label: "Geography weight", value: `×${r.geoWeight.toFixed(2)}` },
        ],
      },
    ],
    notes: [
      "Only views on videos longer than 1 minute qualify for Creator Rewards.",
    ],
  };
}
