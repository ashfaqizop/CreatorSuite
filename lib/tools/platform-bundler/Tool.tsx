"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Field, Input } from "@/components/ui/Field";
import { Check } from "@/components/ui/Toggle";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i), []);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;

  function updateLine(idx: number, patch: Partial<Inputs["lines"][number]>) {
    update({ lines: inputs.lines.map((l, i) => (i === idx ? { ...l, ...patch } : l)) });
  }

  return (
    <ToolLayout
      meta={meta}
      lastUpdated={bench.lastUpdated}
      calculated={calculated}
      report={report}
      onCalculate={calc}
      form={
        <>
          <Field label="Platforms & per-deliverable rates">
            <div className="flex flex-col gap-2">
              {inputs.lines.map((l, i) => (
                <div key={l.platform} className="grid grid-cols-[1fr_110px] gap-2 items-center">
                  <Check
                    label={l.platform}
                    checked={l.enabled}
                    onChange={(on) => updateLine(i, { enabled: on })}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={l.rate}
                    onChange={(e) => updateLine(i, { rate: Number(e.target.value) })}
                    aria-label={`${l.platform} rate`}
                  />
                </div>
              ))}
            </div>
          </Field>
          <Field label="Bundle discount (%)" htmlFor="disc">
            <Input
              id="disc"
              type="number"
              min={0}
              max={100}
              step={1}
              value={inputs.bundleDiscount}
              onChange={(e) => update({ bundleDiscount: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Bundled campaign price">
              <NumberCountUp value={result.bundlePrice} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="À la carte subtotal" value={usd(result.subtotal)} />
              <Stat label="Client saves" value={usd(result.savings)} accent />
            </div>
          </div>
        ) : null
      }
    />
  );
}
