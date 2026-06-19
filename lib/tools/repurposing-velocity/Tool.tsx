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
          <Field label="Pillar pieces per month" htmlFor="pillars">
            <Input id="pillars" type="number" min={0} value={inputs.pillarsPerMonth}
              onChange={(e) => update({ pillarsPerMonth: Number(e.target.value) })} />
          </Field>
          <Field label="Derivatives per pillar" htmlFor="deriv" hint="Clips, posts, threads, etc.">
            <Input id="deriv" type="number" min={0} value={inputs.derivativesPerPillar}
              onChange={(e) => update({ derivativesPerPillar: Number(e.target.value) })} />
          </Field>
          <Field label="Avg views per derivative" htmlFor="avg">
            <Input id="avg" type="number" min={0} value={inputs.avgViewsPerDerivative}
              onChange={(e) => update({ avgViewsPerDerivative: Number(e.target.value) })} />
          </Field>
          <Field label="RPM ($ per 1,000 views) — optional" htmlFor="rpm">
            <Input id="rpm" type="number" min={0} step={0.5} value={inputs.rpm}
              onChange={(e) => update({ rpm: Number(e.target.value) })} />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Monthly reach from repurposing">
              <NumberCountUp value={result.monthlyReach} format={(n) => num(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Derivatives / month" value={num(result.totalDerivatives)} accent />
              <Stat label="Est. monthly revenue" value={usd(result.revenue)} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
