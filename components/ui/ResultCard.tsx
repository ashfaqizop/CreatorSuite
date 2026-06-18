import * as React from "react";
import { cn } from "@/lib/utils";

/** High-contrast readout panel (§4.4). */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-cs-surface border border-cs-border p-6", className)}>
      {children}
    </div>
  );
}

/** Section heading with the signature red dot indicator (§4.4). */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cs-dot font-display text-cs-16 uppercase tracking-wider mb-4 flex items-center">
      {children}
    </h2>
  );
}

/** A primary result readout: large Silkscreen number + red accent dot (§4.4). */
export function ResultCard({
  label,
  children,
  accent = true,
  className,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("bg-cs-surface border border-cs-border p-6", className)}>
      <div className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-3">
        {accent ? (
          <span className="inline-block w-3 h-3 bg-cs-accent shrink-0 self-center" />
        ) : null}
        <span
          className={cn(
            "font-display text-cs-32 md:text-cs-48 leading-none break-all",
            accent ? "text-cs-fg" : "text-cs-fg",
          )}
        >
          {children}
        </span>
      </div>
    </div>
  );
}

/** A small labelled stat for secondary outputs. */
export function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="bg-cs-surface border border-cs-border p-4">
      <div className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted mb-1">
        {label}
      </div>
      <div
        className={cn(
          "font-display text-cs-24 leading-none break-all",
          accent ? "text-cs-accent" : "text-cs-fg",
        )}
      >
        {value}
      </div>
    </div>
  );
}
