"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadInputs, saveInputs } from "@/lib/storage/localPrefs";

/**
 * Shared tool state: input memory (§10.1) + calculate gating + signed-in
 * estimate persistence (§10.2).
 */
export function useTool<I extends Record<string, unknown>, R>(
  slug: string,
  defaultInputs: I,
  calculate: (inputs: I) => R,
) {
  const [inputs, setInputs] = useState<I>(defaultInputs);
  const [result, setResult] = useState<R | null>(null);
  const [calculated, setCalculated] = useState(false);
  const hydrated = useRef(false);

  // Pre-fill from localStorage on mount (§10.1) — syncing React state from an
  // external store (localStorage) is the intended use of this effect.
  useEffect(() => {
    const saved = loadInputs<I>(slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setInputs({ ...defaultInputs, ...saved });
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Persist inputs on change (after hydration to avoid clobbering with defaults).
  useEffect(() => {
    if (hydrated.current) saveInputs(slug, inputs);
  }, [slug, inputs]);

  const update = useCallback((patch: Partial<I>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  }, []);

  const calc = useCallback(() => {
    const r = calculate(inputs);
    setResult(r);
    setCalculated(true);
    // Save to history for signed-in users (no-op / 401 when anonymous).
    void fetch("/api/estimates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool_slug: slug,
        inputs_json: inputs,
        results_json: r,
      }),
    }).catch(() => {});
    return r;
  }, [calculate, inputs, slug]);

  return { inputs, setInputs, update, result, calculated, calc };
}
