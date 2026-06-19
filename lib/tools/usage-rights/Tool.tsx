"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { USAGE_TERM_LABELS, type UsageTerm } from "@/lib/benchmarks/seed";
import { Field, Input, Select } from "@/components/ui/Field";
import { Check } from "@/components/ui/Toggle";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

const TERMS: UsageTerm[] = ["organic", "3mo", "6mo", "12mo", "perpetual"];

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
          <Field label="Base content fee ($)" htmlFor="base">
            <Input
              id="base"
              type="number"
              min={0}
              value={inputs.baseFee}
              onChange={(e) => update({ baseFee: Number(e.target.value) })}
            />
          </Field>
          <Field label="Licensing term" htmlFor="term">
            <Select
              id="term"
              value={inputs.term}
              onChange={(e) => update({ term: e.target.value as UsageTerm })}
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {USAGE_TERM_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Exclusivity">
            <Check
              label="Brand exclusivity required"
              checked={inputs.exclusivity}
              onChange={(v) => update({ exclusivity: v })}
            />
          </Field>
          <Field label="Paid amplification / whitelisting">
            <Check
              label="Brand runs the content as paid ads"
              checked={inputs.paidAmplification}
              onChange={(v) => update({ paidAmplification: v })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Total licensed fee">
              <NumberCountUp value={result.totalFee} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Usage uplift" value={usd(result.uplift)} accent />
              <Stat label="Multiplier" value={`×${result.multiplier.toFixed(2)}`} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
