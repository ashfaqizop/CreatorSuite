import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { usd } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "gear-depreciation",
  name: "Expense & Gear Depreciation Calculator",
  category: "business-ops",
  description:
    "Spread the cost of cameras, computers, and gear into annual and monthly depreciation.",
  enabled: true,
};

export const itemSchema = z.object({
  name: z.string(),
  cost: z.number().min(0),
  lifeYears: z.number().min(0.5),
});
export type GearItem = z.infer<typeof itemSchema>;

export const schema = z.object({ items: z.array(itemSchema).min(1) });
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  items: [
    { name: "Camera", cost: 2000, lifeYears: 5 },
    { name: "Computer / editing rig", cost: 2500, lifeYears: 4 },
    { name: "Lighting & audio", cost: 800, lifeYears: 5 },
  ],
};

export interface Result {
  perItem: Array<{ name: string; annual: number; monthly: number }>;
  totalCost: number;
  totalAnnual: number;
  totalMonthly: number;
}

export function calculate(inputs: Inputs): Result {
  const perItem = inputs.items.map((it) => {
    const annual = it.lifeYears > 0 ? it.cost / it.lifeYears : 0;
    return { name: it.name || "Item", annual, monthly: annual / 12 };
  });
  return {
    perItem,
    totalCost: inputs.items.reduce((s, it) => s + it.cost, 0),
    totalAnnual: perItem.reduce((s, p) => s + p.annual, 0),
    totalMonthly: perItem.reduce((s, p) => s + p.monthly, 0),
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Annual depreciation (deductible)", value: usd(r.totalAnnual) },
    sections: [
      {
        heading: "Gear",
        rows: r.perItem.map((p) => ({
          label: p.name,
          value: `${usd(p.annual)} / yr`,
        })),
      },
      {
        heading: "Totals",
        rows: [
          { label: "Total gear cost", value: usd(r.totalCost) },
          { label: "Annual depreciation", value: usd(r.totalAnnual), accent: true },
          { label: "Monthly depreciation", value: usd(r.totalMonthly) },
        ],
      },
    ],
    notes: ["Straight-line method. Consult a tax professional for actual deductions."],
  };
}
