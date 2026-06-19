import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { BUNDLE_DISCOUNT_DEFAULT } from "@/lib/benchmarks/seed";
import { usd, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "platform-bundler",
  name: "Multi-Platform Bundler",
  category: "brand-deals",
  description:
    "Bundle deliverables across platforms into one campaign price with a bundle discount.",
  enabled: true,
};

export const lineSchema = z.object({
  platform: z.string(),
  rate: z.number().min(0),
  enabled: z.boolean(),
});
export type Line = z.infer<typeof lineSchema>;

export const schema = z.object({
  lines: z.array(lineSchema),
  bundleDiscount: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema>;

export const DEFAULT_PLATFORMS = [
  "YouTube",
  "TikTok",
  "Instagram",
  "X / Twitter",
  "Podcast",
  "Newsletter",
];

export const defaultInputs: Inputs = {
  lines: DEFAULT_PLATFORMS.map((platform, i) => ({
    platform,
    rate: i === 0 ? 1500 : i === 1 ? 800 : i === 2 ? 600 : 0,
    enabled: i < 3,
  })),
  bundleDiscount: BUNDLE_DISCOUNT_DEFAULT,
};

export interface Result {
  subtotal: number;
  bundlePrice: number;
  savings: number;
  activeCount: number;
}

export function calculate(inputs: Inputs): Result {
  const active = inputs.lines.filter((l) => l.enabled);
  const subtotal = active.reduce((sum, l) => sum + l.rate, 0);
  const bundlePrice = subtotal * (1 - inputs.bundleDiscount / 100);
  return {
    subtotal,
    bundlePrice,
    savings: subtotal - bundlePrice,
    activeCount: active.length,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Bundled campaign price", value: usd(r.bundlePrice) },
    sections: [
      {
        heading: "Deliverables",
        rows: [
          ...inputs.lines
            .filter((l) => l.enabled)
            .map((l) => ({ label: l.platform, value: usd(l.rate) })),
          { label: "Bundle discount", value: pct(inputs.bundleDiscount, 0) },
        ],
      },
      {
        heading: "Pricing",
        rows: [
          { label: "À la carte subtotal", value: usd(r.subtotal) },
          { label: "Client saves", value: usd(r.savings) },
          { label: "Bundle price", value: usd(r.bundlePrice), accent: true },
        ],
      },
    ],
  };
}
