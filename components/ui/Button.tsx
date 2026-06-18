import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  "font-display uppercase text-cs-12 tracking-wider px-4 py-3 border transition-none min-h-[44px] inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

const variants: Record<Variant, string> = {
  // Primary = white bg / black text (§4.4)
  primary: "bg-cs-fg text-cs-bg border-cs-fg hover:bg-cs-accent hover:border-cs-accent hover:text-cs-fg",
  // Secondary = outline
  secondary: "bg-transparent text-cs-fg border-cs-border hover:border-cs-accent",
  // Destructive = red
  destructive: "bg-cs-accent text-cs-fg border-cs-accent hover:bg-cs-accent-dim",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
