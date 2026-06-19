import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { SHORT_PLATFORM_LABELS, type ShortPlatform } from "@/lib/benchmarks/seed";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "shortform-estimator",
  name: "Shorts / Reels Estimator",
  category: "ad-revenue",
  description:
    "Estimate short-form ad/bonus revenue from views across YouTube Shorts, Reels, and Facebook.",
  enabled: true,
};

export const schema = z.object({
  monthlyViews: z.number().min(0),
  platform: z.string(),
  usTrafficPct: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema> & { platform: ShortPlatform };

export const defaultInputs: Inputs = {
  monthlyViews: 2000000,
  platform: "youtube-shorts",
  usTrafficPct: 40,
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
  const rpm = bench.shortformRpm[inputs.platform] ?? { low: 0.02, mid: 0.05, high: 0.1 };
  const usFrac = inputs.usTrafficPct / 100;
  const geoWeight = usFrac * bench.usPremiumFactor + (1 - usFrac);
  const k = inputs.monthlyViews / 1000;
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
    headline: { label: "Estimated monthly revenue", value: usd(r.revenue) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Monthly short-form views", value: num(inputs.monthlyViews) },
          { label: "Platform", value: SHORT_PLATFORM_LABELS[inputs.platform] },
          { label: "US traffic", value: pct(inputs.usTrafficPct, 0) },
        ],
      },
      {
        heading: "Revenue",
        rows: [
          { label: "Low estimate", value: usd(r.revenueLow) },
          { label: "Estimate", value: usd(r.revenue), accent: true },
          { label: "High estimate", value: usd(r.revenueHigh) },
          { label: "Annual projection", value: usd(r.annual), accent: true },
        ],
      },
      {
        heading: "Detail",
        rows: [{ label: "Blended RPM (per 1k)", value: usd(r.blendedRpm, true) }],
      },
    ],
    notes: ["Short-form RPMs are far lower than long-form; volume is the driver."],
  };
}
