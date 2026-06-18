"use client";

import { useCallback } from "react";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Field, Input } from "@/components/ui/Field";
import { Check } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ResultCard, Stat } from "@/components/ui/ResultCard";
import { NumberCountUp } from "@/components/ui/NumberCountUp";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { CalculateButton } from "@/components/tool/CalculateButton";
import { useTool } from "@/lib/tools/useTool";
import { usd, num } from "@/lib/utils";
import { meta, defaultInputs, calculate, buildReport, type Inputs, type ToolRow } from "./calc";

export default function Tool({ bench }: { bench: BenchmarkBundle }) {
  const calcFn = useCallback((i: Inputs) => calculate(i), []);
  const { inputs, update, result, calculated, calc } = useTool<Inputs, ReturnType<typeof calcFn>>(
    meta.slug,
    defaultInputs,
    calcFn,
  );
  const report = result ? buildReport(inputs, result) : null;

  function updateRow(idx: number, patch: Partial<ToolRow>) {
    update({ tools: inputs.tools.map((t, i) => (i === idx ? { ...t, ...patch } : t)) });
  }
  function addCustom() {
    update({
      tools: [
        ...inputs.tools,
        { id: `custom-${Date.now()}`, name: "Custom tool", cost: 10, enabled: true },
      ],
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
          <Field label="AI tools used (monthly cost editable)">
            <div className="flex flex-col gap-2">
              {inputs.tools.map((t, i) => (
                <div key={t.id} className="grid grid-cols-[1fr_90px] gap-2 items-center">
                  <Check
                    label={t.name}
                    checked={t.enabled}
                    onChange={(on) => updateRow(i, { enabled: on })}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={t.cost}
                    onChange={(e) => updateRow(i, { cost: Number(e.target.value) })}
                    aria-label={`${t.name} monthly cost`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button type="button" variant="secondary" onClick={addCustom}>
                + Add custom tool
              </Button>
            </div>
          </Field>
          <Field label="Content pieces produced per month" htmlFor="pieces">
            <Input
              id="pieces"
              type="number"
              min={0}
              value={inputs.piecesPerMonth}
              onChange={(e) => update({ piecesPerMonth: Number(e.target.value) })}
            />
          </Field>
          <Field label="Time saved per piece (hours)" htmlFor="time">
            <Input
              id="time"
              type="number"
              min={0}
              step={0.25}
              value={inputs.timeSavedPerPiece}
              onChange={(e) => update({ timeSavedPerPiece: Number(e.target.value) })}
            />
          </Field>
          <Field label="Your hourly rate ($)" htmlFor="rate">
            <Input
              id="rate"
              type="number"
              min={0}
              value={inputs.hourlyRate}
              onChange={(e) => update({ hourlyRate: Number(e.target.value) })}
            />
          </Field>
          <CalculateButton />
        </>
      }
      results={
        result ? (
          <div className="flex flex-col gap-4">
            <ResultCard label="Net AI ROI / month">
              <NumberCountUp value={result.netRoi} format={(n) => usd(n)} />
            </ResultCard>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Monthly AI spend" value={usd(result.totalCost)} accent />
              <Stat label="Time value saved" value={usd(result.timeValueSaved)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Cost per piece" value={usd(result.costPerPiece, true)} />
              <Stat label="Break-even volume" value={`${num(Math.ceil(result.breakEvenPieces))} pcs`} />
            </div>
          </div>
        ) : null
      }
    />
  );
}
