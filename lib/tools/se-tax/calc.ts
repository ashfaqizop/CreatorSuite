import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { usd, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "se-tax",
  name: "Self-Employment Tax Estimator",
  category: "business-ops",
  description:
    "Estimate US self-employment tax and a quarterly set-aside from your net creator income.",
  enabled: true,
};

// 2025 US figures. CREATORSUITE-TODO[ops]: refresh annually via admin/env.
const SE_BASE_FACTOR = 0.9235;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const SS_WAGE_BASE = 176100;

export const schema = z.object({
  netIncome: z.number().min(0),
  incomeTaxRate: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  netIncome: 60000,
  incomeTaxRate: 12,
};

export interface Result {
  seTax: number;
  incomeTax: number;
  totalTax: number;
  quarterly: number;
  setAsidePct: number;
}

export function calculate(inputs: Inputs): Result {
  const seBase = inputs.netIncome * SE_BASE_FACTOR;
  const ss = Math.min(seBase, SS_WAGE_BASE) * SS_RATE;
  const medicare = seBase * MEDICARE_RATE;
  const seTax = ss + medicare;
  const incomeTax = inputs.netIncome * (inputs.incomeTaxRate / 100);
  const totalTax = seTax + incomeTax;
  return {
    seTax,
    incomeTax,
    totalTax,
    quarterly: totalTax / 4,
    setAsidePct: inputs.netIncome > 0 ? (totalTax / inputs.netIncome) * 100 : 0,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Quarterly estimated payment", value: usd(r.quarterly) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Net self-employment income", value: usd(inputs.netIncome) },
          { label: "Estimated income tax rate", value: pct(inputs.incomeTaxRate) },
        ],
      },
      {
        heading: "Estimated tax",
        rows: [
          { label: "Self-employment tax (15.3%)", value: usd(r.seTax), accent: true },
          { label: "Income tax (estimated)", value: usd(r.incomeTax) },
          { label: "Total annual tax", value: usd(r.totalTax) },
          { label: "Set aside per quarter", value: usd(r.quarterly), accent: true },
          { label: "Recommended set-aside", value: pct(r.setAsidePct, 0) },
        ],
      },
    ],
    notes: [
      "US estimate using 2025 SE-tax rules. Not tax advice — consult a professional.",
    ],
  };
}
