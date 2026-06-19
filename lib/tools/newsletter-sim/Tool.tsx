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
          <Field label="Free subscribers" htmlFor="free">
            <Input
              id="free"
              type="number"
              min={0}
              value={inputs.freeSubscribers}
              onChange={(e) => update({ freeSubscribers: Number(e.target.value) })}
            />
          </Field>
          <Field
            label="Free → paid conversion (%)"
            htmlFor="conv"
            hint={`Typical newsletter benchmark: ${pct(bench.newsletterConversion?.mid ?? 6)}`}
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
          <Field label="Monthly price ($)" htmlFor="price">
            <Input
              id="price"
              type="number"
              min={0}
              value={inputs.monthlyPrice}
              onChange={(e) => update({ monthlyPrice: Number(e.target.value) })}
            />
          </Field>
          <Field label="Platform fee (%)" htmlFor="fee" hint="Substack ≈ 10%">
            <Input
              id="fee"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.platformFeePct}
              onChange={(e) => update({ platformFeePct: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Net monthly recurring revenue">
              <NumberCountUp value={result.netMrr} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Paid subscribers" value={Math.round(result.paidSubs).toLocaleString()} accent />
              <Stat label="Gross MRR" value={usd(result.grossMrr)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Platform fee cost" value={usd(result.feeCost)} />
              <Stat label="Annual (net)" value={usd(result.annualNet)} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
