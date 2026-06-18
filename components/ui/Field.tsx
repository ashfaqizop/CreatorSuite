import * as React from "react";
import { cn } from "@/lib/utils";

/** Label + optional benchmark hint wrapper shared by all inputs (§4.4). */
export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-cs-12 uppercase tracking-wide text-cs-fg-muted"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <span className="font-mono text-cs-12 text-cs-fg-muted">{hint}</span>
      ) : null}
    </div>
  );
}

const inputBase =
  "w-full bg-cs-surface border border-cs-border text-cs-fg font-mono text-cs-16 px-3 py-3 min-h-[44px] outline-none focus:border-cs-accent focus:ring-2 focus:ring-cs-accent placeholder:text-cs-fg-dim";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputBase, className)} {...props} />
));
Input.displayName = "Input";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(inputBase, "appearance-none", className)} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";

/** Dot-matrix range slider (§4.4) — styling lives in globals.css `.cs-slider`. */
export const Slider = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="range"
    className={cn("cs-slider", className)}
    {...props}
  />
));
Slider.displayName = "Slider";
