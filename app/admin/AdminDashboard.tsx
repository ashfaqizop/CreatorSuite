"use client";

import { useState } from "react";
import type { ToolMeta } from "@/types";
import { NICHES, NICHE_LABELS, type NicheSlug } from "@/types";
import type { BenchmarkBundle } from "@/lib/benchmarks/seed";
import { Panel, SectionTitle } from "@/components/ui/ResultCard";
import { Field, Input } from "@/components/ui/Field";
import { Check } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";

export function AdminDashboard({
  initialBench,
  initialTools,
}: {
  initialBench: BenchmarkBundle;
  initialTools: ToolMeta[];
}) {
  const [bench, setBench] = useState<BenchmarkBundle>(initialBench);
  const [tools, setTools] = useState<ToolMeta[]>(initialTools);
  const [raw, setRaw] = useState(() => JSON.stringify(initialBench, null, 2));
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setRpm(niche: NicheSlug, key: "low" | "mid" | "high", value: number) {
    setBench((b) => ({
      ...b,
      cpmRpm: { ...b.cpmRpm, [niche]: { ...b.cpmRpm[niche], [key]: value } },
    }));
  }
  function setNicheScalar(group: "engagement" | "sponsorshipCpm", niche: NicheSlug, value: number) {
    setBench((b) => ({ ...b, [group]: { ...b[group], [niche]: value } }));
  }

  async function saveTable() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/benchmarks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bench),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    setMsg(res.ok ? `Saved. Last updated ${data.lastUpdated}.` : `Error: ${data.error ?? res.status}`);
    if (res.ok) setRaw(JSON.stringify({ ...bench, lastUpdated: data.lastUpdated }, null, 2));
  }

  async function saveRaw() {
    setSaving(true);
    setMsg(null);
    let parsed: BenchmarkBundle;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setSaving(false);
      setMsg("Invalid JSON.");
      return;
    }
    const res = await fetch("/api/admin/benchmarks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setBench(parsed);
      setMsg(`Saved. Last updated ${data.lastUpdated}.`);
    } else {
      setMsg(`Error: ${data.error ?? res.status}`);
    }
  }

  async function toggleTool(slug: string, enabled: boolean) {
    setTools((ts) => ts.map((t) => (t.slug === slug ? { ...t, enabled } : t)));
    await fetch("/api/admin/tools", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, enabled }),
    });
  }

  return (
    <div className="flex flex-col gap-8 max-w-[900px]">
      <h1 className="font-display text-cs-32">Admin Dashboard</h1>
      {msg ? (
        <div className="border border-cs-border bg-cs-surface px-4 py-2 font-mono text-cs-12 text-cs-accent">
          {msg}
        </div>
      ) : null}

      {/* Tool toggle (§7) */}
      <Panel>
        <SectionTitle>Tools</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tools.map((t) => (
            <Check
              key={t.slug}
              label={t.name}
              checked={t.enabled}
              onChange={(v) => toggleTool(t.slug, v)}
            />
          ))}
        </div>
      </Panel>

      {/* Benchmark editor — per-niche key values (§7) */}
      <Panel>
        <SectionTitle>Benchmarks — niche values</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-cs-12">
            <thead>
              <tr className="text-cs-fg-muted text-left">
                <th className="p-2 border border-cs-border">Niche</th>
                <th className="p-2 border border-cs-border">RPM low</th>
                <th className="p-2 border border-cs-border">RPM mid</th>
                <th className="p-2 border border-cs-border">RPM high</th>
                <th className="p-2 border border-cs-border">Engagement %</th>
                <th className="p-2 border border-cs-border">Sponsor CPM</th>
              </tr>
            </thead>
            <tbody>
              {NICHES.map((n) => (
                <tr key={n}>
                  <td className="p-2 border border-cs-border">{NICHE_LABELS[n]}</td>
                  {(["low", "mid", "high"] as const).map((k) => (
                    <td key={k} className="p-1 border border-cs-border">
                      <NumCell
                        value={bench.cpmRpm[n][k]}
                        onChange={(v) => setRpm(n, k, v)}
                      />
                    </td>
                  ))}
                  <td className="p-1 border border-cs-border">
                    <NumCell
                      value={bench.engagement[n]}
                      onChange={(v) => setNicheScalar("engagement", n, v)}
                    />
                  </td>
                  <td className="p-1 border border-cs-border">
                    <NumCell
                      value={bench.sponsorshipCpm[n]}
                      onChange={(v) => setNicheScalar("sponsorshipCpm", n, v)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Button onClick={saveTable} disabled={saving}>
            {saving ? "Saving…" : "Save niche values"}
          </Button>
        </div>
      </Panel>

      {/* Full bundle editor — covers UGC, conversion, platform fees, etc. */}
      <Panel>
        <SectionTitle>Benchmarks — full bundle (JSON)</SectionTitle>
        <Field label="Edit any benchmark value. Saving validates JSON.">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            className="w-full h-[360px] bg-cs-surface border border-cs-border text-cs-fg font-mono text-cs-12 p-3 outline-none focus:border-cs-accent"
          />
        </Field>
        <div className="mt-4">
          <Button onClick={saveRaw} disabled={saving}>
            {saving ? "Saving…" : "Save full bundle"}
          </Button>
        </div>
      </Panel>

      {/* Niche manager — niches are code-defined constants in v1.0 */}
      <Panel>
        <SectionTitle>Niches</SectionTitle>
        <p className="font-mono text-cs-12 text-cs-fg-muted mb-2">
          {NICHES.length} niches active. Adding/removing niches is a code change
          in v1.0.
          {/* CREATORSUITE-TODO[v1.x]: DB-backed niche list for dynamic add/remove. */}
        </p>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <span
              key={n}
              className="font-mono text-cs-12 border border-cs-border px-2 py-1 text-cs-fg-muted"
            >
              {NICHE_LABELS[n]}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function NumCell({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Input
      type="number"
      step="any"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="text-cs-12 px-2 py-1 min-h-0 h-8"
    />
  );
}
