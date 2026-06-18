import { z } from "zod";
import type { ToolMeta, ToolReport } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { PRODUCT_TYPE_LABELS, type ProductType } from "@/lib/benchmarks/seed";
import { usd, num, pct } from "@/lib/utils";

export const meta: ToolMeta = {
  slug: "product-launch",
  name: "Digital Product Launch Calculator",
  category: "audience-funnels",
  description:
    "Predict launch revenue from traffic, conversion, and checkout behavior.",
  enabled: true,
};

export const schema = z.object({
  productType: z.string(),
  traffic: z.number().min(0),
  conversionRate: z.number().min(0).max(100),
  price: z.number().min(0),
  abandonRate: z.number().min(0).max(100),
  affiliatePct: z.number().min(0).max(100),
});
export type Inputs = z.infer<typeof schema> & { productType: ProductType };

export const defaultInputs: Inputs = {
  productType: "mini-course",
  traffic: 10000,
  conversionRate: 2.5,
  price: 49,
  abandonRate: 65,
  affiliatePct: 0,
};

export interface Result {
  reachedCheckout: number;
  completedSales: number;
  abandonedCarts: number;
  grossRevenue: number;
  netRevenue: number;
  benchConversion: number;
  benchAbandon: number;
}

export function calculate(inputs: Inputs, bench: BenchmarkBundle): Result {
  const reachedCheckout = inputs.traffic * (inputs.conversionRate / 100);
  const completedSales = reachedCheckout * (1 - inputs.abandonRate / 100);
  const abandonedCarts = reachedCheckout - completedSales;
  const grossRevenue = completedSales * inputs.price;
  const netRevenue = grossRevenue * (1 - inputs.affiliatePct / 100);

  const benchmarks = bench.conversion[inputs.productType];
  return {
    reachedCheckout,
    completedSales,
    abandonedCarts,
    grossRevenue,
    netRevenue,
    benchConversion: benchmarks?.conversion.mid ?? 2,
    benchAbandon: benchmarks?.abandon.mid ?? 65,
  };
}

export function buildReport(inputs: Inputs, r: Result): ToolReport {
  return {
    toolName: meta.name,
    headline: { label: "Net launch revenue", value: usd(r.netRevenue) },
    sections: [
      {
        heading: "Inputs",
        rows: [
          { label: "Product type", value: PRODUCT_TYPE_LABELS[inputs.productType] },
          { label: "Sales page traffic", value: num(inputs.traffic) },
          { label: "Conversion rate", value: pct(inputs.conversionRate) },
          { label: "Price", value: usd(inputs.price) },
          { label: "Checkout abandon rate", value: pct(inputs.abandonRate) },
          { label: "Affiliate commission", value: pct(inputs.affiliatePct) },
        ],
      },
      {
        heading: "Funnel",
        rows: [
          { label: "Reached checkout", value: num(Math.round(r.reachedCheckout)) },
          { label: "Completed sales", value: num(Math.round(r.completedSales)), accent: true },
          { label: "Abandoned carts", value: num(Math.round(r.abandonedCarts)) },
        ],
      },
      {
        heading: "Revenue",
        rows: [
          { label: "Gross revenue", value: usd(r.grossRevenue) },
          { label: "Net revenue", value: usd(r.netRevenue), accent: true },
        ],
      },
      {
        heading: "Benchmark comparison",
        rows: [
          { label: "Typical conversion", value: pct(r.benchConversion) },
          { label: "Typical abandon", value: pct(r.benchAbandon) },
        ],
      },
    ],
  };
}
