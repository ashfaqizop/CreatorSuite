import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { USAGE_TERM_LABELS, type UsageTerm } from "@/lib/benchmarks/seed";
import { usd, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "usage-rights",
  name: "Usage Rights Multiplier",
  category: "brand-deals",
  description:
    "Add the right premium to a base content fee for licensing term, exclusivity, and paid amplification.",
  enabled: true,
};

export const schema = z.object({
  baseFee: z.number().min(0),
  term: z.string(),
  exclusivity: z.boolean(),
  paidAmplification: z.boolean(),
});
export type Inputs = z.infer<typeof schema> & { term: UsageTerm };

export const defaultInputs: Inputs = {
  baseFee: 1000,
  term: "6mo",
  exclusivity: false,
  paidAmplification: false,
};

export interface Result {
  multiplier: number;
  totalFee: number;
  uplift: number;
  termAdd: number;
  exclusivityAdd: number;
  paidAdd: number;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const ur = bench.usageRights;
  const termAdd = ur.terms[inputs.term] ?? 0;
  const exclusivityAdd = inputs.exclusivity ? ur.exclusivity : 0;
  const paidAdd = inputs.paidAmplification ? ur.paidAmplification : 0;
  const multiplier = 1 + termAdd + exclusivityAdd + paidAdd;
  const totalFee = inputs.baseFee * multiplier;
  return {
    multiplier,
    totalFee,
    uplift: totalFee - inputs.baseFee,
    termAdd,
    exclusivityAdd,
    paidAdd,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Total licensed fee", value: usd(r.totalFee) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Base content fee", value: usd(inputs.baseFee) },
          { label: "Licensing term", value: USAGE_TERM_LABELS[inputs.term] },
          { label: "Exclusivity", value: inputs.exclusivity ? "Yes" : "No" },
          { label: "Paid amplification", value: inputs.paidAmplification ? "Yes" : "No" },
        ],
      },
      {
        heading: "Premiums applied",
        rows: [
          { label: "Term uplift", value: pct(r.termAdd * 100, 0) },
          { label: "Exclusivity uplift", value: pct(r.exclusivityAdd * 100, 0) },
          { label: "Paid amplification uplift", value: pct(r.paidAdd * 100, 0) },
          { label: "Total multiplier", value: `×${r.multiplier.toFixed(2)}`, accent: true },
        ],
      },
      {
        heading: "Result",
        rows: [
          { label: "Usage uplift ($)", value: usd(r.uplift) },
          { label: "Total fee", value: usd(r.totalFee), accent: true },
        ],
      },
    ],
  };
}
