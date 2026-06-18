"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import type { Estimate, ToolReport } from "@/types";
import { getToolMeta } from "@/lib/tools";
import { buildReportFor } from "@/lib/tools/reports";
import { Panel } from "@/components/ui/ResultCard";
import { Button } from "@/components/ui/Button";
import { triggerDownload } from "@/components/tool/ExportPdfButton";

export default function RateCardPage() {
  const { data: session, status } = useSession();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [e, rc] = await Promise.all([
      fetch("/api/estimates").then((r) => r.json()),
      fetch("/api/rate-card").then((r) => r.json()),
    ]);
    setEstimates(e.estimates ?? []);
    setPinned(rc.pinned_estimate_ids ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    let active = true;
    (async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }
      await load();
      if (!active) return;
    })();
    return () => {
      active = false;
    };
  }, [session, status, load]);

  const pinnedEstimates = estimates.filter((e) => pinned.includes(e.id));
  const reports = pinnedEstimates
    .map((e) => buildReportFor(e.tool_slug, e.inputs_json, e.results_json))
    .filter((r): r is ToolReport => Boolean(r));

  async function unpin(id: string) {
    const next = pinned.filter((p) => p !== id);
    setPinned(next);
    await fetch("/api/rate-card", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned_estimate_ids: next }),
    });
  }

  async function exportCombined() {
    if (reports.length === 0) return;
    setBusy(true);
    try {
      const [{ pdf }, { RateCardPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/ToolPdfDocument"),
      ]);
      const blob = await pdf(<RateCardPdfDocument reports={reports} />).toBlob();
      triggerDownload(blob, "creatorsuite-rate-card.pdf");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading" || loading) {
    return <p className="font-mono text-cs-fg-muted">Loading…</p>;
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col gap-4 max-w-md">
        <h1 className="font-display text-cs-32">Rate Card</h1>
        <p className="font-mono text-cs-fg-muted">
          Sign in to assemble a branded rate card from your estimates.
        </p>
        <div>
          <Button onClick={() => signIn("google")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[760px]">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display text-cs-32">Rate Card</h1>
        <Button onClick={exportCombined} disabled={reports.length === 0 || busy}>
          {busy ? "Generating…" : "Export Rate Card PDF"}
        </Button>
      </div>
      <p className="font-mono text-cs-12 text-cs-fg-muted">
        Pin estimates from your History to build a professional rate card to send
        to brands.
      </p>

      {pinnedEstimates.length === 0 ? (
        <p className="font-mono text-cs-fg-muted">
          Nothing pinned yet. Go to History and pin your best estimates.
        </p>
      ) : (
        pinnedEstimates.map((e) => {
          const meta = getToolMeta(e.tool_slug);
          const report = buildReportFor(e.tool_slug, e.inputs_json, e.results_json);
          return (
            <Panel key={e.id}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-display text-cs-16">
                    {meta?.name ?? e.tool_slug}
                  </div>
                  {report ? (
                    <div className="font-mono text-cs-12 text-cs-fg-muted mt-1">
                      {report.headline.label}:{" "}
                      <span className="text-cs-accent">{report.headline.value}</span>
                    </div>
                  ) : null}
                </div>
                <Button variant="secondary" onClick={() => unpin(e.id)}>
                  Unpin
                </Button>
              </div>
            </Panel>
          );
        })
      )}
    </div>
  );
}
