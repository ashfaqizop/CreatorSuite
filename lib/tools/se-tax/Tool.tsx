"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Field, Input } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd, pct } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i), []);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;

  return (
    <ToolLayout
      meta={meta}
      lastUpdated={bench.lastUpdated}
      calculated={calculated}
      report={report}
      onCalculate={calc}
      form={
        <>
          <Field label="Net self-employment income (annual $)" htmlFor="net">
            <Input id="net" type="number" min={0} value={inputs.netIncome}
              onChange={(e) => update({ netIncome: Number(e.target.value) })} />
          </Field>
          <Field
            label="Estimated income tax rate (%)"
            htmlFor="rate"
            hint="Your marginal/effective federal rate. SE tax is calculated separately."
          >
            <Input id="rate" type="number" min={0} max={100} step={0.5} value={inputs.incomeTaxRate}
              onChange={(e) => update({ incomeTaxRate: Number(e.target.value) })} />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Quarterly estimated payment">
              <NumberCountUp value={result.quarterly} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="SE tax (15.3%)" value={usd(result.seTax)} accent />
              <Stat label="Income tax (est)" value={usd(result.incomeTax)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Total annual tax" value={usd(result.totalTax)} />
              <Stat label="Set-aside" value={pct(result.setAsidePct, 0)} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
