import { z } from "zod";
import type { NicheSlug, ToolMeta, ToolReport } from "@/types";
import { NICHE_LABELS, NICHES } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { BLOG_NETWORK_LABELS, type BlogNetwork } from "@/lib/benchmarks/seed";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "blog-rpm",
  name: "Blog & Website RPM Forecaster",
  category: "ad-revenue",
  description:
    "Forecast display-ad revenue from pageviews, niche, ad network, and geography.",
  enabled: true,
};

export const schema = z.object({
  monthlyPageviews: z.number().min(0),
  niche: z.string(),
  network: z.string(),
  usTrafficPct: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema> & {
  niche: NicheSlug;
  network: BlogNetwork;
};

export const defaultInputs: Inputs = {
  monthlyPageviews: 100000,
  niche: "tech",
  network: "adsense",
  usTrafficPct: 40,
};

export interface Result {
  effectiveRpm: number;
  revenue: number;
  revenueLow: number;
  revenueHigh: number;
  annual: number;
  nicheWeight: number;
  geoWeight: number;
}

/** Average of niche RPM mids — used to weight blog RPM by niche. */
function avgCpmMid(bench: BenchmarkBundle): number {
  const mids = NICHES.map((n) => bench.cpmRpm[n]?.mid ?? 0);
  return mids.reduce((a, b) => a + b, 0) / mids.length;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const range = bench.blogRpm[inputs.network] ?? { low: 3, mid: 8, high: 15 };
  const nicheWeight = (bench.cpmRpm[inputs.niche]?.mid ?? avgCpmMid(bench)) / avgCpmMid(bench);

  const usFrac = inputs.usTrafficPct / 100;
  const geoWeight = usFrac * bench.usPremiumFactor + (1 - usFrac);

  const k = inputs.monthlyPageviews / 1000;
  const effectiveRpm = range.mid * nicheWeight * geoWeight;
  const revenue = k * effectiveRpm;
  return {
    effectiveRpm,
    revenue,
    revenueLow: k * range.low * nicheWeight * geoWeight,
    revenueHigh: k * range.high * nicheWeight * geoWeight,
    annual: revenue * 12,
    nicheWeight,
    geoWeight,
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
          { label: "Monthly pageviews", value: num(inputs.monthlyPageviews) },
          { label: "Niche", value: NICHE_LABELS[inputs.niche] },
          { label: "Ad network", value: BLOG_NETWORK_LABELS[inputs.network] },
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
        heading: "RPM detail",
        rows: [
          { label: "Effective session RPM", value: usd(r.effectiveRpm, true) },
          { label: "Niche weight", value: `×${r.nicheWeight.toFixed(2)}` },
          { label: "Geography weight", value: `×${r.geoWeight.toFixed(2)}` },
        ],
      },
    ],
    notes: ["Premium networks (Mediavine, Raptive) require minimum traffic thresholds."],
  };
}
