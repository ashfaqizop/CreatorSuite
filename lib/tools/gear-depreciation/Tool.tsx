"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs, type GearItem } from "./calc";

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i), []);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;

  function updateItem(idx: number, patch: Partial<GearItem>) {
    update({ items: inputs.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) });
  }
  function addItem() {
    update({ items: [...inputs.items, { name: "", cost: 0, lifeYears: 5 }] });
  }
  function removeItem(idx: number) {
    if (inputs.items.length <= 1) return;
    update({ items: inputs.items.filter((_, i) => i !== idx) });
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
          <Field label="Gear & equipment (cost + useful life in years)">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[1fr_90px_70px_44px] gap-2 font-mono text-cs-12 text-cs-fg-dim uppercase">
                <span>Item</span><span>Cost</span><span>Years</span><span />
              </div>
              {inputs.items.map((it, i) => (
                <div key={i} className="grid grid-cols-[1fr_90px_70px_44px] gap-2 items-center">
                  <Input placeholder="Item" value={it.name}
                    onChange={(e) => updateItem(i, { name: e.target.value })} />
                  <Input type="number" min={0} value={it.cost}
                    onChange={(e) => updateItem(i, { cost: Number(e.target.value) })} />
                  <Input type="number" min={0.5} step={0.5} value={it.lifeYears}
                    onChange={(e) => updateItem(i, { lifeYears: Number(e.target.value) })} />
                  <button type="button" onClick={() => removeItem(i)} disabled={inputs.items.length <= 1}
                    className="h-[44px] border border-cs-border text-cs-fg-muted hover:border-cs-accent hover:text-cs-accent disabled:opacity-30 cursor-pointer" aria-label="Remove">✕</button>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button type="button" variant="secondary" onClick={addItem}>+ Add item</Button>
            </div>
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Annual depreciation (deductible)">
              <NumberCountUp value={result.totalAnnual} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Monthly depreciation" value={usd(result.totalMonthly)} accent />
              <Stat label="Total gear cost" value={usd(result.totalCost)} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
