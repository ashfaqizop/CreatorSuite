import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { PODCAST_AD_LABELS, type PodcastAdType } from "@/lib/benchmarks/seed";
import { usd, num } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "podcast-ads",
  name: "Podcast Audio Ad Calculator",
  category: "ad-revenue",
  description:
    "Estimate podcast sponsorship revenue from downloads, ad type, and ad slots per episode.",
  enabled: true,
};

export const schema = z.object({
  downloadsPerEpisode: z.number().min(0),
  episodesPerMonth: z.number().min(0),
  adType: z.string(),
  adSlots: z.number().min(0),
});
export type Inputs = z.infer<typeof schema> & { adType: PodcastAdType };

export const defaultInputs: Inputs = {
  downloadsPerEpisode: 5000,
  episodesPerMonth: 4,
  adType: "hostread",
  adSlots: 2,
};

export interface Result {
  cpm: number;
  revenuePerEpisode: number;
  monthly: number;
  monthlyLow: number;
  monthlyHigh: number;
  annual: number;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const cpmRange = bench.podcastCpm[inputs.adType] ?? { low: 12, mid: 18, high: 25 };
  const impressionsK = (inputs.downloadsPerEpisode / 1000) * inputs.adSlots;
  const revenuePerEpisode = impressionsK * cpmRange.mid;
  const monthly = revenuePerEpisode * inputs.episodesPerMonth;
  return {
    cpm: cpmRange.mid,
    revenuePerEpisode,
    monthly,
    monthlyLow: impressionsK * cpmRange.low * inputs.episodesPerMonth,
    monthlyHigh: impressionsK * cpmRange.high * inputs.episodesPerMonth,
    annual: monthly * 12,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Estimated monthly ad revenue", value: usd(r.monthly) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Downloads / episode", value: num(inputs.downloadsPerEpisode) },
          { label: "Episodes / month", value: num(inputs.episodesPerMonth) },
          { label: "Ad type", value: PODCAST_AD_LABELS[inputs.adType] },
          { label: "Ad slots / episode", value: num(inputs.adSlots) },
        ],
      },
      {
        heading: "Revenue",
        rows: [
          { label: "Per episode", value: usd(r.revenuePerEpisode) },
          { label: "Monthly (low)", value: usd(r.monthlyLow) },
          { label: "Monthly", value: usd(r.monthly), accent: true },
          { label: "Monthly (high)", value: usd(r.monthlyHigh) },
          { label: "Annual projection", value: usd(r.annual), accent: true },
        ],
      },
      {
        heading: "Detail",
        rows: [{ label: "CPM used (per 1k)", value: usd(r.cpm) }],
      },
    ],
  };
}
