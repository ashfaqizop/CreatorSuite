"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { NICHES, NICHE_LABELS, type NicheSlug } from "@/types";
import { Field, Input, Select } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd, pct } from "@/lib/utils";
import {
  meta,
  defaultInputs,
  calculate,
  buildReport,
  PLATFORMS,
  PLATFORM_LABELS,
  DELIVERABLES,
  DELIVERABLE_LABELS,
  type Inputs,
} from "./calc";

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
          <Field label="Monthly average views" htmlFor="views">
            <Input
              id="views"
              type="number"
              min={0}
              value={inputs.monthlyViews}
              onChange={(e) => update({ monthlyViews: Number(e.target.value) })}
            />
          </Field>
          <Field
            label="Engagement rate (%)"
            htmlFor="eng"
            hint={`Niche average: ${pct(bench.engagement[inputs.niche] ?? 3)}`}
          >
            <Input
              id="eng"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.engagementRate}
              onChange={(e) => update({ engagementRate: Number(e.target.value) })}
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
          <Field label="Platform" htmlFor="platform">
            <Select
              id="platform"
              value={inputs.platform}
              onChange={(e) => update({ platform: e.target.value as Inputs["platform"] })}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_LABELS[p]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Deliverable type" htmlFor="deliverable">
            <Select
              id="deliverable"
              value={inputs.deliverable}
              onChange={(e) =>
                update({ deliverable: e.target.value as Inputs["deliverable"] })
              }
            >
              {DELIVERABLES.map((d) => (
                <option key={d} value={d}>
                  {DELIVERABLE_LABELS[d]}
                </option>
              ))}
            </Select>
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Suggested flat fee (mid)">
              <NumberCountUp value={result.mid} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Low" value={usd(result.low)} />
              <Stat label="High" value={usd(result.high)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Niche CPM factor" value={`${usd(result.cpmFactor)} / 1k`} />
              <Stat
                label="Vs niche engagement"
                value={result.aboveAverage ? "Above avg" : "At/below"}
                accent={result.aboveAverage}
              />
            </div>
          </div>
        ) : null
      }
    />
  );
}
