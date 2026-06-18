"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { NICHES, NICHE_LABELS, type NicheSlug } from "@/types";
import { Field, Input, Select } from "@/components/ui/Field";
import { Check } from "@/components/ui/Toggle";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd, num } from "@/lib/utils";
import {
  meta,
  defaultInputs,
  calculate,
  buildReport,
  SOURCES,
  SOURCE_LABELS,
  type Inputs,
  type Source,
} from "./calc";

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i, bench), [bench]);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;

  function setAlloc(s: Source, value: number) {
    update({ allocations: { ...inputs.allocations, [s]: value } });
  }
  function toggleSource(s: Source, on: boolean) {
    setAlloc(s, on ? inputs.allocations[s] || 10 : 0);
  }
  const total = SOURCES.reduce((sum, s) => sum + (inputs.allocations[s] ?? 0), 0);

  return (
    <ToolLayout
      meta={meta}
      lastUpdated={bench.lastUpdated}
      calculated={calculated}
      report={report}
      onCalculate={calc}
      form={
        <>
          <Field label="Monthly survival income target ($)" htmlFor="target">
            <Input
              id="target"
              type="number"
              min={0}
              value={inputs.monthlyTarget}
              onChange={(e) => update({ monthlyTarget: Number(e.target.value) })}
            />
          </Field>
          <Field label="Niche" htmlFor="niche">
            <Select
              id="niche"
              value={inputs.niche}
              onChange={(e) => update({ niche: e.target.value as NicheSlug })}
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {NICHE_LABELS[n]}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Income sources & % contribution"
            hint={`Allocation total: ${total}%`}
          >
            <div className="flex flex-col gap-2">
              {SOURCES.map((s) => {
                const enabled = (inputs.allocations[s] ?? 0) > 0;
                return (
                  <div key={s} className="grid grid-cols-[1fr_90px] gap-2 items-center">
                    <Check
                      label={SOURCE_LABELS[s]}
                      checked={enabled}
                      onChange={(on) => toggleSource(s, on)}
                    />
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={inputs.allocations[s] ?? 0}
                      onChange={(e) => setAlloc(s, Number(e.target.value))}
                      aria-label={`${SOURCE_LABELS[s]} percent`}
                    />
                  </div>
                );
              })}
            </div>
          </Field>
          <Field label="Current monthly income ($) — optional" htmlFor="current">
            <Input
              id="current"
              type="number"
              min={0}
              value={inputs.currentIncome}
              onChange={(e) => update({ currentIncome: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Remaining gap to target">{usd(result.gap)}</ResultCard>
            {result.totalPct !== 100 ? (
              <p className="font-mono text-cs-12 text-cs-accent">
                ■ Allocations sum to {result.totalPct}% — adjust to 100% for an accurate plan.
              </p>
            ) : null}
            <div className="flex flex-col gap-3">
              {result.plans.map((p) => (
                <Stat
                  key={p.source}
                  label={`${SOURCE_LABELS[p.source]} · ${p.pct}% · ${usd(p.income)}`}
                  value={`${num(Math.ceil(p.metricValue))} ${p.metricLabel}`}
                  accent
                />
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
}
