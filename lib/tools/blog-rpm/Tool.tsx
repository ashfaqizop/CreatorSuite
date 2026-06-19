"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { BLOG_NETWORK_LABELS, type BlogNetwork } from "@/lib/benchmarks/seed";
import { NICHES, NICHE_LABELS, type NicheSlug } from "@/types";
import { Field, Input, Select, Slider } from "@/components/ui/Field";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs } from "./calc";

const NETWORKS = Object.keys(BLOG_NETWORK_LABELS) as BlogNetwork[];

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
          <Field label="Monthly pageviews" htmlFor="pv">
            <Input
              id="pv"
              type="number"
              min={0}
              value={inputs.monthlyPageviews}
              onChange={(e) => update({ monthlyPageviews: Number(e.target.value) })}
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
          <Field label="Ad network" htmlFor="net">
            <Select
              id="net"
              value={inputs.network}
              onChange={(e) => update({ network: e.target.value as BlogNetwork })}
            >
              {NETWORKS.map((n) => (
                <option key={n} value={n}>
                  {BLOG_NETWORK_LABELS[n]}
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
              <Stat label="Effective RPM" value={usd(result.effectiveRpm, true)} accent />
              <Stat label="Annual" value={usd(result.annual)} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
