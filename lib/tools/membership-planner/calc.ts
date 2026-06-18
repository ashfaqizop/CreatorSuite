import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { PLATFORM_LABELS, type MembershipPlatform } from "@/lib/benchmarks/seed";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "membership-planner",
  name: "Patreon / Membership Tier Planner",
  category: "audience-funnels",
  description:
    "Model monthly recurring revenue across community tiers, minus platform fees.",
  enabled: true,
};

export const tierSchema = z.object({
  name: z.string(),
  price: z.number().min(0),
  members: z.number().min(0),
});
export type Tier = z.infer<typeof tierSchema>;

export const schema = z.object({
  tiers: z.array(tierSchema).min(1).max(5),
  platform: z.string(),
  feePct: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema> & { platform: MembershipPlatform };

export const defaultInputs: Inputs = {
  tiers: [
    { name: "Supporter", price: 5, members: 100 },
    { name: "Insider", price: 15, members: 30 },
    { name: "VIP", price: 50, members: 8 },
  ],
  platform: "patreon",
  feePct: 8,
};

export interface Result {
  perTier: Array<{ name: string; gross: number }>;
  grossMrr: number;
  netMrr: number;
  feeCost: number;
  annualNet: number;
}

export function calculate(inputs: Inputs): Result {
  const perTier = inputs.tiers.map((t) => ({
    name: t.name || "Tier",
    gross: t.price * t.members,
  }));
  const grossMrr = perTier.reduce((sum, t) => sum + t.gross, 0);
  const netMrr = grossMrr * (1 - inputs.feePct / 100);
  return {
    perTier,
    grossMrr,
    netMrr,
    feeCost: grossMrr - netMrr,
    annualNet: netMrr * 12,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Net monthly recurring revenue", value: usd(r.netMrr) },
    sections: [
      {
        heading: "Tiers",
        rows: [
          ...inputs.tiers.map((t) => ({
            label: `${t.name || "Tier"} — ${usd(t.price)} × ${num(t.members)}`,
            value: usd(t.price * t.members),
          })),
          { label: `Platform`, value: PLATFORM_LABELS[inputs.platform] },
          { label: "Platform fee", value: pct(inputs.feePct) },
        ],
      },
      {
        heading: "Revenue",
        rows: [
          { label: "Gross MRR", value: usd(r.grossMrr) },
          { label: "Platform fee cost", value: usd(r.feeCost) },
          { label: "Net MRR", value: usd(r.netMrr), accent: true },
          { label: "Annual projection (net)", value: usd(r.annualNet), accent: true },
        ],
      },
    ],
  };
}
