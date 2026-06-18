"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import {
  PLATFORM_LABELS,
  PLATFORM_FEES,
  type MembershipPlatform,
} from "@/lib/benchmarks/seed";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs, type Tier } from "./calc";

const PLATFORMS = Object.keys(PLATFORM_LABELS) as MembershipPlatform[];

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i), []);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;

  function updateTier(idx: number, patch: Partial<Tier>) {
    const tiers = inputs.tiers.map((t, i) => (i === idx ? { ...t, ...patch } : t));
    update({ tiers });
  }
  function addTier() {
    if (inputs.tiers.length >= 5) return;
    update({ tiers: [...inputs.tiers, { name: "", price: 0, members: 0 }] });
  }
  function removeTier(idx: number) {
    if (inputs.tiers.length <= 1) return;
    update({ tiers: inputs.tiers.filter((_, i) => i !== idx) });
  }
  function setPlatform(p: MembershipPlatform) {
    update({ platform: p, feePct: PLATFORM_FEES[p] });
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
          <Field label="Membership tiers (up to 5)">
            <div className="flex flex-col gap-3">
              {inputs.tiers.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_80px_44px] gap-2 items-center">
                  <Input
                    placeholder="Tier name"
                    value={t.name}
                    onChange={(e) => updateTier(i, { name: e.target.value })}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="$/mo"
                    value={t.price}
                    onChange={(e) => updateTier(i, { price: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Members"
                    value={t.members}
                    onChange={(e) => updateTier(i, { members: Number(e.target.value) })}
                  />
                  <button
                    type="button"
                    onClick={() => removeTier(i)}
                    disabled={inputs.tiers.length <= 1}
                    className="h-[44px] border border-cs-border text-cs-fg-muted hover:border-cs-accent hover:text-cs-accent disabled:opacity-30 cursor-pointer"
                    aria-label="Remove tier"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {inputs.tiers.length < 5 ? (
              <div className="mt-3">
                <Button type="button" variant="secondary" onClick={addTier}>
                  + Add tier
                </Button>
              </div>
            ) : null}
          </Field>

          <Field label="Platform" htmlFor="platform">
            <Select
              id="platform"
              value={inputs.platform}
              onChange={(e) => setPlatform(e.target.value as MembershipPlatform)}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_LABELS[p]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Platform fee (%)" htmlFor="fee">
            <Input
              id="fee"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={inputs.feePct}
              onChange={(e) => update({ feePct: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Net monthly recurring revenue">
              <NumberCountUp value={result.netMrr} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Gross MRR" value={usd(result.grossMrr)} />
              <Stat label="Platform fee cost" value={usd(result.feeCost)} accent />
            </div>
            <Stat label="Annual projection (net)" value={usd(result.annualNet)} />
          </div>
        ) : null
      }
    />
  );
}
