// Anonymous last-input memory (§10.1). Keyed by tool slug.

const KEY = (slug: string) => `creatorsuite:inputs:${slug}`;

export function loadInputs<T>(slug: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY(slug));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveInputs<T>(slug: string, inputs: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY(slug), JSON.stringify(inputs));
  } catch {
    /* quota / disabled — ignore */
  }
}
