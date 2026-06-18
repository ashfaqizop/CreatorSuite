/** Minimal className joiner — avoids a dependency for the Dot Matrix primitives. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Format a number as USD currency (whole dollars unless cents requested). */
export function usd(value: number, cents = false): string {
  if (!Number.isFinite(value)) return "$0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

/** Format a number with thousands separators. */
export function num(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Format a 0..1 ratio (or already-percent value) as a percent string. */
export function pct(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}
