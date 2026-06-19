import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { usd, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "commission-calc",
  name: "Agency / Manager Commission Calculator",
  category: "business-ops",
  description:
    "See your real take-home from a deal after agency commission and expenses.",
  enabled: true,
};

export const schema = z.object({
  grossDeal: z.number().min(0),
  commissionRate: z.number().min(0).max(100),
  expenses: z.number().min(0),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  grossDeal: 5000,
  commissionRate: 20,
  expenses: 0,
};

export interface Result {
  commission: number;
  netToCreator: number;
  takeHomePct: number;
}

export function calculate(inputs: Inputs): Result {
  const commission = inputs.grossDeal * (inputs.commissionRate / 100);
  const netToCreator = inputs.grossDeal - commission - inputs.expenses;
  return {
    commission,
    netToCreator,
    takeHomePct: inputs.grossDeal > 0 ? (netToCreator / inputs.grossDeal) * 100 : 0,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Your take-home", value: usd(r.netToCreator) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Gross deal value", value: usd(inputs.grossDeal) },
          { label: "Commission rate", value: pct(inputs.commissionRate) },
          { label: "Expenses", value: usd(inputs.expenses) },
        ],
      },
      {
        heading: "Breakdown",
        rows: [
          { label: "Agency commission", value: usd(r.commission), accent: true },
          { label: "Net to you", value: usd(r.netToCreator), accent: true },
          { label: "Effective take-home", value: pct(r.takeHomePct, 0) },
        ],
      },
    ],
  };
}
