import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "newsletter-sim",
  name: "Paid Newsletter / Substack Simulator",
  category: "audience-funnels",
  description:
    "Model paid-newsletter MRR from free subscribers, conversion, price, and platform fees.",
  enabled: true,
};

export const schema = z.object({
  freeSubscribers: z.number().min(0),
  conversionRate: z.number().min(0).max(100),
  monthlyPrice: z.number().min(0),
  platformFeePct: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  freeSubscribers: 10000,
  conversionRate: 6,
  monthlyPrice: 8,
  platformFeePct: 10,
};

export interface Result {
  paidSubs: number;
  grossMrr: number;
  netMrr: number;
  feeCost: number;
  annualNet: number;
}

export function calculate(inputs: Inputs): Result {
  const paidSubs = inputs.freeSubscribers * (inputs.conversionRate / 100);
  const grossMrr = paidSubs * inputs.monthlyPrice;
  const netMrr = grossMrr * (1 - inputs.platformFeePct / 100);
  return {
    paidSubs,
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
        heading: "Inputs",
        rows: [
          { label: "Free subscribers", value: num(inputs.freeSubscribers) },
          { label: "Free → paid conversion", value: pct(inputs.conversionRate) },
          { label: "Monthly price", value: usd(inputs.monthlyPrice) },
          { label: "Platform fee", value: pct(inputs.platformFeePct) },
        ],
      },
      {
        heading: "Revenue",
        rows: [
          { label: "Paid subscribers", value: num(Math.round(r.paidSubs)) },
          { label: "Gross MRR", value: usd(r.grossMrr) },
          { label: "Platform fee cost", value: usd(r.feeCost) },
          { label: "Net MRR", value: usd(r.netMrr), accent: true },
          { label: "Annual projection (net)", value: usd(r.annualNet), accent: true },
        ],
      },
    ],
  };
}
