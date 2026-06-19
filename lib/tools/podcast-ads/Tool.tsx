"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { PODCAST_AD_LABELS, type PodcastAdType } from "@/lib/benchmarks/seed";
import { Field, Input, Select } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

const AD_TYPES = Object.keys(PODCAST_AD_LABELS) as PodcastAdType[];

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
          <Field label="Downloads per episode" htmlFor="dl">
            <Input
              id="dl"
              type="number"
              min={0}
              value={inputs.downloadsPerEpisode}
              onChange={(e) => update({ downloadsPerEpisode: Number(e.target.value) })}
            />
          </Field>
          <Field label="Episodes per month" htmlFor="eps">
            <Input
              id="eps"
              type="number"
              min={0}
              value={inputs.episodesPerMonth}
              onChange={(e) => update({ episodesPerMonth: Number(e.target.value) })}
            />
          </Field>
          <Field label="Ad type" htmlFor="type">
            <Select
              id="type"
              value={inputs.adType}
              onChange={(e) => update({ adType: e.target.value as PodcastAdType })}
            >
              {AD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PODCAST_AD_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ad slots per episode" htmlFor="slots">
            <Input
              id="slots"
              type="number"
              min={0}
              value={inputs.adSlots}
              onChange={(e) => update({ adSlots: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Estimated monthly ad revenue">
              <NumberCountUp value={result.monthly} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Per episode" value={usd(result.revenuePerEpisode)} accent />
              <Stat label="Annual" value={usd(result.annual)} />
            </div>
            <Stat label="Monthly range" value={`${usd(result.monthlyLow)}–${usd(result.monthlyHigh)}`} />
          </div>
        ) : null
      }
    />
  );
}
