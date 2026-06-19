"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Field, Input, Slider } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i, bench), [bench]);
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
          <Field
            label="Qualified views per month"
            htmlFor="views"
            hint="Only videos longer than 1 minute count toward Creator Rewards."
          >
            <Input
              id="views"
              type="number"
              min={0}
              value={inputs.qualifiedViews}
              onChange={(e) => update({ qualifiedViews: Number(e.target.value) })}
            />
          </Field>
          <Field label={`US traffic — ${inputs.usTrafficPct}%`} htmlFor="us">
            <Slider
              id="us"
              min={0}
              max={100}
              value={inputs.usTrafficPct}
              onChange={(e) => update({ usTrafficPct: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Estimated monthly rewards">
              <NumberCountUp value={result.revenue} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Low" value={usd(result.revenueLow)} />
              <Stat label="High" value={usd(result.revenueHigh)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Blended RPM" value={usd(result.blendedRpm, true)} accent />
              <Stat label="Annual" value={usd(result.annual)} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
