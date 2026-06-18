"use client";

import type { ReactNode } from "react";
import type { ToolMeta, ToolReport } from "@/types";
import { CATEGORY_LABELS } from "@/lib/tools/categories";
import { Panel, SectionTitle } from "@/components/ui/ResultCard";
import { AdSlot } from "@/components/AdSlot";
import { SignInBanner } from "@/components/tool/SignInBanner";
import { ExportPdfButton } from "@/components/tool/ExportPdfButton";

/**
 * Standard tool page: Inputs → (ad after interaction) → Result panel → PDF
 * export (§5 pattern, §6.3 ad rules, §10.1 sign-in banner).
 */
export function ToolLayout({
  meta,
  lastUpdated,
  calculated,
  report,
  form,
  results,
  onCalculate,
}: {
  meta: ToolMeta;
  lastUpdated: string;
  calculated: boolean;
  report: ToolReport | null;
  form: ReactNode;
  results: ReactNode;
  onCalculate: () => void;
}) {
  return (
    <div className="flex flex-col gap-8 max-w-[760px]">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-cs-12 uppercase tracking-wide text-cs-accent">
          {CATEGORY_LABELS[meta.category]}
        </span>
        <h1 className="font-display text-cs-32 leading-tight">{meta.name}</h1>
        <p className="font-mono text-cs-16 text-cs-fg-muted">{meta.description}</p>
        <span className="font-mono text-cs-12 text-cs-fg-dim">
          Benchmarks last updated {lastUpdated}
        </span>
      </header>

      {/* Inputs — ads never appear inside this panel (§6.3) */}
      <Panel>
        <SectionTitle>Inputs</SectionTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCalculate();
          }}
          className="flex flex-col gap-5"
        >
          {form}
        </form>
      </Panel>

      {/* Between-section ad — only after the user has interacted (§6.3) */}
      {calculated ? (
        <>
          <div className="hidden md:flex justify-center">
            <AdSlot placement="between-section" />
          </div>
          <SignInBanner />
        </>
      ) : null}

      {/* Results */}
      {calculated && report ? (
        <Panel>
          <div className="flex items-center justify-between gap-4 mb-4">
            <SectionTitle>Results</SectionTitle>
            <ExportPdfButton report={report} />
          </div>
          {results}
        </Panel>
      ) : null}

      {/* Mobile banner below the result panel only (§6.3, §11) */}
      {calculated ? (
        <div className="md:hidden flex justify-center">
          <AdSlot placement="mobile-banner" />
        </div>
      ) : null}
    </div>
  );
}
