import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import { AI_TOOL_PRESETS } from "@/lib/benchmarks/seed";
import { usd, num } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "ai-cost",
  name: "AI Output Cost Estimator",
  category: "content-production",
  description:
    "Weigh AI tool spend against content output speed to measure profitability.",
  enabled: true,
};

export const toolRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  cost: z.number().min(0),
  enabled: z.boolean(),
});
export type ToolRow = z.infer<typeof toolRowSchema>;

export const schema = z.object({
  tools: z.array(toolRowSchema),
  piecesPerMonth: z.number().min(0),
  timeSavedPerPiece: z.number().min(0),
  hourlyRate: z.number().min(0),
});
export type Inputs = z.infer<typeof schema>;

export const defaultInputs: Inputs = {
  tools: AI_TOOL_PRESETS.map((t, i) => ({ ...t, enabled: i < 2 })),
  piecesPerMonth: 20,
  timeSavedPerPiece: 1.5,
  hourlyRate: 40,
};

export interface Result {
  totalCost: number;
  timeValueSaved: number;
  netRoi: number;
  costPerPiece: number;
  breakEvenPieces: number;
}

export function calculate(inputs: Inputs): Result {
  const totalCost = inputs.tools
    .filter((t) => t.enabled)
    .reduce((sum, t) => sum + t.cost, 0);
  const timeValueSaved =
    inputs.piecesPerMonth * inputs.timeSavedPerPiece * inputs.hourlyRate;
  const valuePerPiece = inputs.timeSavedPerPiece * inputs.hourlyRate;
  return {
    totalCost,
    timeValueSaved,
    netRoi: timeValueSaved - totalCost,
    costPerPiece: inputs.piecesPerMonth > 0 ? totalCost / inputs.piecesPerMonth : 0,
    breakEvenPieces: valuePerPiece > 0 ? totalCost / valuePerPiece : 0,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Net AI ROI / month", value: usd(r.netRoi) },
    sections: [
      {
        heading: "AI tools",
        rows: [
          ...inputs.tools
            .filter((t) => t.enabled)
            .map((t) => ({ label: t.name, value: usd(t.cost) })),
          { label: "Total monthly AI spend", value: usd(r.totalCost), accent: true },
        ],
      },
      {
        heading: "Output",
        rows: [
          { label: "Pieces / month", value: num(inputs.piecesPerMonth) },
          { label: "Time saved / piece", value: `${inputs.timeSavedPerPiece} h` },
          { label: "Hourly rate", value: usd(inputs.hourlyRate) },
        ],
      },
      {
        heading: "Results",
        rows: [
          { label: "Time value saved", value: usd(r.timeValueSaved) },
          { label: "Net ROI", value: usd(r.netRoi), accent: true },
          { label: "Cost per piece", value: usd(r.costPerPiece, true) },
          {
            label: "Break-even content volume",
            value: `${num(Math.ceil(r.breakEvenPieces))} pieces`,
          },
        ],
      },
    ],
  };
}
