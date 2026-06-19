"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { SHORT_PLATFORM_LABELS, type ShortPlatform } from "@/lib/benchmarks/seed";
import { Field, Input, Select, Slider } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

const PLATFORMS = Object.keys(SHORT_PLATFORM_LABELS) as ShortPlatform[];

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
          <Field label="Monthly short-form views" htmlFor="views">
            <Input
              id="views"
              type="number"
              min={0}
              value={inputs.monthlyViews}
              onChange={(e) => update({ monthlyViews: Number(e.target.value) })}
            />
          </Field>
          <Field label="Platform" htmlFor="platform">
            <Select
              id="platform"
              value={inputs.platform}
              onChange={(e) => update({ platform: e.target.value as ShortPlatform })}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {SHORT_PLATFORM_LABELS[p]}
                </option>
              ))}
            </Select>
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
            <ResultCard label="Estimated monthly revenue">
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
