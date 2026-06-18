"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { PRODUCT_TYPE_LABELS, type ProductType } from "@/lib/benchmarks/seed";
import { Field, Input, Select } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd, num, pct } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

const TYPES = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[];

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i, bench), [bench]);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;
  const typeBench = bench.conversion[inputs.productType];

  return (
    <ToolLayout
      meta={meta}
      lastUpdated={bench.lastUpdated}
      calculated={calculated}
      report={report}
      onCalculate={calc}
      form={
        <>
          <Field label="Product type" htmlFor="type">
            <Select
              id="type"
              value={inputs.productType}
              onChange={(e) => update({ productType: e.target.value as ProductType })}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {PRODUCT_TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Sales page traffic" htmlFor="traffic">
            <Input
              id="traffic"
              type="number"
              min={0}
              value={inputs.traffic}
              onChange={(e) => update({ traffic: Number(e.target.value) })}
            />
          </Field>
          <Field
            label="Conversion rate (%)"
            htmlFor="conv"
            hint={`Typical for ${PRODUCT_TYPE_LABELS[inputs.productType]}: ${pct(typeBench?.conversion.mid ?? 2)}`}
          >
            <Input
              id="conv"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.conversionRate}
              onChange={(e) => update({ conversionRate: Number(e.target.value) })}
            />
          </Field>
          <Field label="Product price ($)" htmlFor="price">
            <Input
              id="price"
              type="number"
              min={0}
              value={inputs.price}
              onChange={(e) => update({ price: Number(e.target.value) })}
            />
          </Field>
          <Field
            label="Checkout abandon rate (%)"
            htmlFor="abandon"
            hint={`Typical: ${pct(typeBench?.abandon.mid ?? 65)}`}
          >
            <Input
              id="abandon"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.abandonRate}
              onChange={(e) => update({ abandonRate: Number(e.target.value) })}
            />
          </Field>
          <Field label="Affiliate commission (%) — optional" htmlFor="aff">
            <Input
              id="aff"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.affiliatePct}
              onChange={(e) => update({ affiliatePct: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Net launch revenue">
              <NumberCountUp value={result.netRevenue} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Gross revenue" value={usd(result.grossRevenue)} />
              <Stat label="Completed sales" value={num(Math.round(result.completedSales))} accent />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Reached checkout" value={num(Math.round(result.reachedCheckout))} />
              <Stat label="Abandoned carts" value={num(Math.round(result.abandonedCarts))} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
