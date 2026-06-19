import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "hook-retention",
  name: "Hook Retention Value Estimator",
  category: "content-production",
  description:
    "Estimate the extra reach and revenue from improving your opening-hook retention.",
  enabled: true,
};

// How strongly a relative retention gain translates into extra distribution.
const DISTRIBUTION_SENSITIVITY = 0.5;

export const schema = z.object({
  currentViews: z.number().min(0),
  currentRetention: z.number().min(0).max(100),
  targetRetention: z.number().min(0).max(100),
  rpm: z.number().min(0),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  currentViews: 100000,
  currentRetention: 60,
  targetRetention: 75,
  rpm: 5,
};

export interface Result {
  upliftFactor: number;
  additionalViews: number;
  additionalRevenue: number;
  newTotalViews: number;
}

export function calculate(inputs: Inputs): Result {
  const rel =
    inputs.currentRetention > 0
      ? (inputs.targetRetention - inputs.currentRetention) / inputs.currentRetention
      : 0;
  const upliftFactor = Math.max(0, rel * DISTRIBUTION_SENSITIVITY);
  const additionalViews = inputs.currentViews * upliftFactor;
  return {
    upliftFactor,
    additionalViews,
    additionalRevenue: (additionalViews / 1000) * inputs.rpm,
    newTotalViews: inputs.currentViews + additionalViews,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Extra monthly revenue from a better hook", value: usd(r.additionalRevenue) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Current monthly views", value: num(inputs.currentViews) },
          { label: "Current hook retention", value: pct(inputs.currentRetention, 0) },
          { label: "Target hook retention", value: pct(inputs.targetRetention, 0) },
          { label: "RPM (per 1k views)", value: usd(inputs.rpm, true) },
        ],
      },
      {
        heading: "Projected impact",
        rows: [
          { label: "Estimated reach uplift", value: pct(r.upliftFactor * 100, 1) },
          { label: "Additional views / month", value: num(Math.round(r.additionalViews)), accent: true },
          { label: "Additional revenue / month", value: usd(r.additionalRevenue), accent: true },
          { label: "New total monthly views", value: num(Math.round(r.newTotalViews)) },
        ],
      },
    ],
    notes: ["A directional model: distribution depends on many signals beyond the hook."],
  };
}
