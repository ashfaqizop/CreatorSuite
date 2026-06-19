"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Field, Input } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd, num } from "@/lib/utils";
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
          <Field label="Current monthly views" htmlFor="views">
            <Input id="views" type="number" min={0} value={inputs.currentViews}
              onChange={(e) => update({ currentViews: Number(e.target.value) })} />
          </Field>
          <Field label="Current hook retention (% past 3s)" htmlFor="cur">
            <Input id="cur" type="number" min={0} max={100} step={1} value={inputs.currentRetention}
              onChange={(e) => update({ currentRetention: Number(e.target.value) })} />
          </Field>
          <Field label="Target hook retention (%)" htmlFor="tar">
            <Input id="tar" type="number" min={0} max={100} step={1} value={inputs.targetRetention}
              onChange={(e) => update({ targetRetention: Number(e.target.value) })} />
          </Field>
          <Field label="RPM ($ per 1,000 views)" htmlFor="rpm">
            <Input id="rpm" type="number" min={0} step={0.5} value={inputs.rpm}
              onChange={(e) => update({ rpm: Number(e.target.value) })} />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Extra monthly revenue from a better hook">
              <NumberCountUp value={result.additionalRevenue} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Additional views/mo" value={num(Math.round(result.additionalViews))} accent />
              <Stat label="New total views/mo" value={num(Math.round(result.newTotalViews))} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
