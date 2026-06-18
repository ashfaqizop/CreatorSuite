"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import type { Estimate } from "@/types";
import { getToolMeta } from "@/lib/tools";
import { buildReportFor } from "@/lib/tools/reports";
import { saveInputs } from "@/lib/storage/localPrefs";
import { Panel } from "@/components/ui/ResultCard";
import { Button } from "@/components/ui/Button";
import { ExportPdfButton } from "@/components/tool/ExportPdfButton";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function togglePin(id: string) {
    const next = pinned.includes(id)
      ? pinned.filter((p) => p !== id)
      : [...pinned, id];
    setPinned(next);
    await fetch("/api/rate-card", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned_estimate_ids: next }),
    });
  }

  async function remove(id: string) {
    await fetch(`/api/estimates?id=${id}`, { method: "DELETE" });
    setEstimates((prev) => prev.filter((e) => e.id !== id));
  }

  function reload(e: Estimate) {
    saveInputs(e.tool_slug, e.inputs_json);
    router.push(`/tools/${e.tool_slug}`);
  }

  if (status === "loading" || loading) {
    return <p className="font-mono text-cs-fg-muted">Loading…</p>;
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col gap-4 max-w-md">
        <h1 className="font-display text-cs-32">History</h1>
        <p className="font-mono text-cs-fg-muted">
          Sign in to save and revisit your estimates.
        </p>
        <div>
          <Button onClick={() => signIn("google")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[760px]">
      <h1 className="font-display text-cs-32">Estimate History</h1>
      {estimates.length === 0 ? (
        <p className="font-mono text-cs-fg-muted">
          No estimates yet. Run any tool and your results will appear here.
        </p>
      ) : (
        estimates.map((e) => {
          const meta = getToolMeta(e.tool_slug);
          const report = buildReportFor(e.tool_slug, e.inputs_json, e.results_json);
          const isPinned = pinned.includes(e.id);
          return (
            <Panel key={e.id}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-display text-cs-16">
                      {meta?.name ?? e.tool_slug}
                    </div>
                    <div className="font-mono text-cs-12 text-cs-fg-muted">
                      {new Date(e.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  {report ? (
                    <div className="text-right">
                      <div className="font-mono text-cs-12 text-cs-fg-muted uppercase">
                        {report.headline.label}
                      </div>
                      <div className="font-display text-cs-24 text-cs-accent">
                        {report.headline.value}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => reload(e)}>
                    Reload
                  </Button>
                  <Button
                    variant={isPinned ? "destructive" : "secondary"}
                    onClick={() => togglePin(e.id)}
                  >
                    {isPinned ? "Unpin" : "Pin to Rate Card"}
                  </Button>
                  <ExportPdfButton report={report} />
                  <Button variant="secondary" onClick={() => remove(e.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Panel>
          );
        })
      )}
    </div>
  );
}
