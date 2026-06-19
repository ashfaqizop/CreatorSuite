import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { usd, num } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "repurposing-velocity",
  name: "Repurposing Velocity Calculator",
  category: "content-production",
  description:
    "See the reach and revenue multiplier from turning pillar content into many derivatives.",
  enabled: true,
};

export const schema = z.object({
  pillarsPerMonth: z.number().min(0),
  derivativesPerPillar: z.number().min(0),
  avgViewsPerDerivative: z.number().min(0),
  rpm: z.number().min(0),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  pillarsPerMonth: 4,
  derivativesPerPillar: 6,
  avgViewsPerDerivative: 5000,
  rpm: 4,
};

export interface Result {
  totalDerivatives: number;
  monthlyReach: number;
  revenue: number;
  annualReach: number;
}

export function calculate(inputs: Inputs): Result {
  const totalDerivatives = inputs.pillarsPerMonth * inputs.derivativesPerPillar;
  const monthlyReach = totalDerivatives * inputs.avgViewsPerDerivative;
  return {
    totalDerivatives,
    monthlyReach,
    revenue: (monthlyReach / 1000) * inputs.rpm,
    annualReach: monthlyReach * 12,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Monthly reach from repurposing", value: num(r.monthlyReach) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Pillar pieces / month", value: num(inputs.pillarsPerMonth) },
          { label: "Derivatives / pillar", value: num(inputs.derivativesPerPillar) },
          { label: "Avg views / derivative", value: num(inputs.avgViewsPerDerivative) },
          { label: "RPM (per 1k views)", value: usd(inputs.rpm, true) },
        ],
      },
      {
        heading: "Output",
        rows: [
          { label: "Total derivatives / month", value: num(r.totalDerivatives), accent: true },
          { label: "Monthly reach", value: num(r.monthlyReach), accent: true },
          { label: "Estimated monthly revenue", value: usd(r.revenue) },
          { label: "Annual reach", value: num(r.annualReach) },
        ],
      },
    ],
  };
}
