"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Field, Input } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd, num, pct } from "@/lib/utils";
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
          <Field label="Members at start of month" htmlFor="start">
            <Input id="start" type="number" min={0} value={inputs.startMembers}
              onChange={(e) => update({ startMembers: Number(e.target.value) })} />
          </Field>
          <Field label="New members gained" htmlFor="new">
            <Input id="new" type="number" min={0} value={inputs.newMembers}
              onChange={(e) => update({ newMembers: Number(e.target.value) })} />
          </Field>
          <Field label="Members churned (lost)" htmlFor="churned">
            <Input id="churned" type="number" min={0} value={inputs.churnedMembers}
              onChange={(e) => update({ churnedMembers: Number(e.target.value) })} />
          </Field>
          <Field label="Avg revenue per member / month ($)" htmlFor="arpu">
            <Input id="arpu" type="number" min={0} value={inputs.arpu}
              onChange={(e) => update({ arpu: Number(e.target.value) })} />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Monthly churn rate">
              <NumberCountUp value={result.churnRate} format={(n) => pct(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Retention rate" value={pct(result.retentionRate)} />
              <Stat label="Net growth" value={num(result.netGrowth)} accent={result.netGrowth >= 0} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Avg lifetime" value={Number.isFinite(result.avgLifetimeMonths) ? `${num(result.avgLifetimeMonths, 1)} mo` : "—"} />
              <Stat label="Lifetime value" value={usd(result.ltv)} accent />
            </div>
          </div>
        ) : null
      }
    />
  );
}
