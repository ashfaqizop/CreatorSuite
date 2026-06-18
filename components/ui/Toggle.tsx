"use client";

import { cn } from "@/lib/utils";

/** Square checkbox / toggle in the dot-matrix style. */
export function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 min-h-[44px] cursor-pointer text-left"
    >
      <span
        className={cn(
          "w-5 h-5 border shrink-0 flex items-center justify-center",
          checked ? "bg-cs-accent border-cs-accent" : "border-cs-border bg-cs-surface",
        )}
      >
        {checked ? <span className="w-2 h-2 bg-cs-fg" /> : null}
      </span>
      <span className="font-mono text-cs-16">{label}</span>
    </button>
  );
}
