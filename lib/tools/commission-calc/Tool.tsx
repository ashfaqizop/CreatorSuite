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
          <Field label="Gross deal value ($)" htmlFor="gross">
            <Input id="gross" type="number" min={0} value={inputs.grossDeal}
              onChange={(e) => update({ grossDeal: Number(e.target.value) })} />
          </Field>
          <Field label="Commission rate (%)" htmlFor="rate" hint="Agencies/managers typically take 15–25%">
            <Input id="rate" type="number" min={0} max={100} step={0.5} value={inputs.commissionRate}
              onChange={(e) => update({ commissionRate: Number(e.target.value) })} />
          </Field>
          <Field label="Your expenses ($) — optional" htmlFor="exp">
            <Input id="exp" type="number" min={0} value={inputs.expenses}
              onChange={(e) => update({ expenses: Number(e.target.value) })} />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Your take-home">
              <NumberCountUp value={result.netToCreator} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Agency commission" value={usd(result.commission)} accent />
              <Stat label="Take-home" value={pct(result.takeHomePct, 0)} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
