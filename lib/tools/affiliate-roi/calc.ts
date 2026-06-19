import { z } from "zod";
import type { NicheSlug, ToolMeta, ToolReport } from "@/types";
import { NICHE_LABELS } from "@/types";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "affiliate-roi",
  name: "Affiliate ROI Predictor",
  category: "brand-deals",
  description:
    "Predict affiliate earnings and ROI from clicks, conversion, and commission.",
  enabled: true,
};

export const schema = z.object({
  niche: z.string(),
  monthlyClicks: z.number().min(0),
  conversionRate: z.number().min(0).max(100),
  avgOrderValue: z.number().min(0),
  commission: z.number().min(0).max(100),
  contentCost: z.number().min(0),
});
export type Inputs = z.infer<typeof schema> & { niche: NicheSlug };

export const defaultInputs: Inputs = {
  niche: "tech",
  monthlyClicks: 5000,
  conversionRate: 2,
  avgOrderValue: 90,
  commission: 8,
  contentCost: 0,
};

export interface Result {
  sales: number;
  revenue: number;
  net: number;
  roi: number | null;
  epc: number; // earnings per click
}

export function calculate(inputs: Inputs): Result {
  const sales = inputs.monthlyClicks * (inputs.conversionRate / 100);
  const revenue = sales * inputs.avgOrderValue * (inputs.commission / 100);
  const net = revenue - inputs.contentCost;
  return {
    sales,
    revenue,
    net,
    roi: inputs.contentCost > 0 ? (net / inputs.contentCost) * 100 : null,
    epc: inputs.monthlyClicks > 0 ? revenue / inputs.monthlyClicks : 0,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Monthly affiliate revenue", value: usd(r.revenue) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Niche", value: NICHE_LABELS[inputs.niche] },
          { label: "Monthly clicks", value: num(inputs.monthlyClicks) },
          { label: "Conversion rate", value: pct(inputs.conversionRate) },
          { label: "Avg order value", value: usd(inputs.avgOrderValue) },
          { label: "Commission", value: pct(inputs.commission) },
          { label: "Content cost", value: usd(inputs.contentCost) },
        ],
      },
      {
        heading: "Results",
        rows: [
          { label: "Sales / month", value: num(Math.round(r.sales)) },
          { label: "Revenue", value: usd(r.revenue), accent: true },
          { label: "Net (after cost)", value: usd(r.net) },
          { label: "Earnings per click (EPC)", value: usd(r.epc, true) },
          {
            label: "ROI",
            value: r.roi === null ? "—" : pct(r.roi, 0),
            accent: r.roi !== null && r.roi > 0,
          },
        ],
      },
    ],
  };
}
