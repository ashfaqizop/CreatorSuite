"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { USAGE_TIER_LABELS, type UsageTier } from "@/lib/benchmarks/seed";
import { Field, Input, Select } from "@/components/ui/Field";
import { Check } from "@/components/ui/Toggle";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import {
  meta,
  defaultInputs,
  calculate,
  buildReport,
  PLATFORMS,
  PLATFORM_LABELS,
  REVISIONS,
  type Inputs,
  type UgcPlatform,
} from "./calc";

const TIERS: UsageTier[] = [
  "organic",
  "whitelist-30",
  "whitelist-90",
  "whitelist-12mo",
  "buyout",
];

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i, bench), [bench]);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;

  function togglePlatform(p: UgcPlatform, on: boolean) {
    const set = new Set(inputs.platforms);
    if (on) set.add(p);
    else set.delete(p);
    update({ platforms: Array.from(set) });
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
          <Field label="Number of video deliverables" htmlFor="deliverables">
            <Input
              id="deliverables"
              type="number"
              min={1}
              value={inputs.deliverables}
              onChange={(e) => update({ deliverables: Number(e.target.value) })}
            />
          </Field>
          <Field label="Usage rights" htmlFor="tier">
            <Select
              id="tier"
              value={inputs.usageTier}
              onChange={(e) => update({ usageTier: e.target.value as UsageTier })}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {USAGE_TIER_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Platforms included">
            <div className="flex flex-col gap-1">
              {PLATFORMS.map((p) => (
                <Check
                  key={p}
                  label={PLATFORM_LABELS[p]}
                  checked={inputs.platforms.includes(p)}
                  onChange={(on) => togglePlatform(p, on)}
                />
              ))}
            </div>
          </Field>
          <Field label="Revision rounds included" htmlFor="revisions">
            <Select
              id="revisions"
              value={inputs.revisions}
              onChange={(e) => update({ revisions: e.target.value as Inputs["revisions"] })}
            >
              {REVISIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "unlimited" ? "Unlimited" : r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Exclusivity">
            <Check
              label="Exclusivity required (+25%)"
              checked={inputs.exclusivity}
              onChange={(v) => update({ exclusivity: v })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Package rate">
              <NumberCountUp value={result.packageRate} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Rate per video" value={usd(result.perVideo)} accent />
              <Stat label="Per-video range" value={`${usd(result.perVideoLow)}–${usd(result.perVideoHigh)}`} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
