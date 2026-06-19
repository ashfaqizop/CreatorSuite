"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { NICHES, NICHE_LABELS, type NicheSlug } from "@/types";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
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

  function applyNicheBenchmarks(n: NicheSlug) {
    const a = bench.affiliate[n];
    update({
      niche: n,
      conversionRate: a?.conversion ?? inputs.conversionRate,
      avgOrderValue: a?.aov ?? inputs.avgOrderValue,
      commission: a?.commission ?? inputs.commission,
    });
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
          <Field label="Niche (prefills benchmark rates)" htmlFor="niche">
            <Select
              id="niche"
              value={inputs.niche}
              onChange={(e) => applyNicheBenchmarks(e.target.value as NicheSlug)}
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {NICHE_LABELS[n]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Monthly affiliate link clicks" htmlFor="clicks">
            <Input
              id="clicks"
              type="number"
              min={0}
              value={inputs.monthlyClicks}
              onChange={(e) => update({ monthlyClicks: Number(e.target.value) })}
            />
          </Field>
          <Field
            label="Conversion rate (%)"
            htmlFor="conv"
            hint={`Niche benchmark: ${pct(bench.affiliate[inputs.niche]?.conversion ?? 2)}`}
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
          <Field
            label="Average order value ($)"
            htmlFor="aov"
            hint={`Niche benchmark: ${usd(bench.affiliate[inputs.niche]?.aov ?? 90)}`}
          >
            <Input
              id="aov"
              type="number"
              min={0}
              value={inputs.avgOrderValue}
              onChange={(e) => update({ avgOrderValue: Number(e.target.value) })}
            />
          </Field>
          <Field
            label="Commission (%)"
            htmlFor="comm"
            hint={`Niche benchmark: ${pct(bench.affiliate[inputs.niche]?.commission ?? 8)}`}
          >
            <Input
              id="comm"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.commission}
              onChange={(e) => update({ commission: Number(e.target.value) })}
            />
          </Field>
          <Field label="Content / promo cost ($) — optional" htmlFor="cost">
            <Input
              id="cost"
              type="number"
              min={0}
              value={inputs.contentCost}
              onChange={(e) => update({ contentCost: Number(e.target.value) })}
            />
          </Field>
          <div className="flex gap-2 flex-wrap">
            <CalculateButton />
            <Button
              type="button"
              variant="secondary"
              onClick={() => applyNicheBenchmarks(inputs.niche)}
            >
              Use niche benchmarks
            </Button>
          </div>
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Monthly affiliate revenue">
              <NumberCountUp value={result.revenue} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Sales / month" value={num(Math.round(result.sales))} />
              <Stat label="Earnings per click" value={usd(result.epc, true)} accent />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Net (after cost)" value={usd(result.net)} />
              <Stat label="ROI" value={result.roi === null ? "—" : pct(result.roi, 0)} accent={result.roi !== null && result.roi > 0} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
