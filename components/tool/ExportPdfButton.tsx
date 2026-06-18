"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ToolReport } from "@/types";

/** Downloads a branded PDF for a single tool report (§9). Renderer is imported
 *  dynamically on click to keep it out of the initial bundle. */
export function ExportPdfButton({
  report,
  disabled,
}: {
  report: ToolReport | null;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    if (!report) return;
    setBusy(true);
    try {
      const [{ pdf }, { ToolPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/ToolPdfDocument"),
      ]);
      const blob = await pdf(<ToolPdfDocument report={report} />).toBlob();
      triggerDownload(blob, `creatorsuite-${slugify(report.toolName)}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={disabled || !report || busy}
    >
      {busy ? "Generating…" : "Export PDF"}
    </Button>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
