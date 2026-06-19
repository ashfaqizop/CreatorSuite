import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "churn-rate",
  name: "Community Churn Rate Calculator",
  category: "audience-funnels",
  description:
    "Measure membership churn, retention, average lifetime, and lifetime value.",
  enabled: true,
};

export const schema = z.object({
  startMembers: z.number().min(0),
  newMembers: z.number().min(0),
  churnedMembers: z.number().min(0),
  arpu: z.number().min(0),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  startMembers: 500,
  newMembers: 60,
  churnedMembers: 25,
  arpu: 8,
};

export interface Result {
  churnRate: number;
  retentionRate: number;
  netGrowth: number;
  endMembers: number;
  avgLifetimeMonths: number;
  ltv: number;
}

export function calculate(inputs: Inputs): Result {
  const churnRate =
    inputs.startMembers > 0 ? (inputs.churnedMembers / inputs.startMembers) * 100 : 0;
  const avgLifetimeMonths = churnRate > 0 ? 100 / churnRate : Infinity;
  return {
    churnRate,
    retentionRate: 100 - churnRate,
    netGrowth: inputs.newMembers - inputs.churnedMembers,
    endMembers: inputs.startMembers + inputs.newMembers - inputs.churnedMembers,
    avgLifetimeMonths,
    ltv: Number.isFinite(avgLifetimeMonths) ? inputs.arpu * avgLifetimeMonths : 0,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Monthly churn rate", value: pct(r.churnRate) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Members at start", value: num(inputs.startMembers) },
          { label: "New members", value: num(inputs.newMembers) },
          { label: "Churned members", value: num(inputs.churnedMembers) },
          { label: "Avg revenue / member (ARPU)", value: usd(inputs.arpu) },
        ],
      },
      {
        heading: "Results",
        rows: [
          { label: "Churn rate", value: pct(r.churnRate), accent: true },
          { label: "Retention rate", value: pct(r.retentionRate) },
          { label: "Net growth", value: num(r.netGrowth) },
          { label: "Members at end", value: num(r.endMembers) },
          {
            label: "Avg member lifetime",
            value: Number.isFinite(r.avgLifetimeMonths)
              ? `${num(r.avgLifetimeMonths, 1)} months`
              : "—",
          },
          { label: "Lifetime value (LTV)", value: usd(r.ltv), accent: true },
        ],
      },
    ],
  };
}
