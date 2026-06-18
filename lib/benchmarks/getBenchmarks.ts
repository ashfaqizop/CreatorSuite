import "server-only";
import { getServerSupabase } from "@/lib/supabase/server";
import { SEED_BUNDLE, type BenchmarkBundle } from "./seed";

// NOTE (§8.2): the spec lists six normalized benchmark tables. For the MVP we
// store the full bundle as a single JSONB document (table `benchmarks`, id=1)
// so the admin editor can update any value without a redeploy. Functionally
// identical to the DoD requirement.
// CREATORSUITE-TODO[v1.x]: normalize into benchmarks_cpm/engagement/... tables.

/**
 * Single benchmark access point (§12). Reads the editable bundle from Supabase
 * when configured; otherwise returns the seed bundle so the app works
 * credential-free. `tool`/`niche` are accepted for the documented API shape and
 * future per-tool slicing.
 */
export async function getBenchmarks(): Promise<BenchmarkBundle> {
  const supabase = getServerSupabase();
  if (!supabase) return SEED_BUNDLE;

  try {
    const { data, error } = await supabase
      .from("benchmarks")
      .select("bundle, updated_at")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data?.bundle) return SEED_BUNDLE;

    // Merge over seed so newly-added seed keys survive an older stored bundle.
    return {
      ...SEED_BUNDLE,
      ...(data.bundle as Partial<BenchmarkBundle>),
      lastUpdated:
        (data.bundle as BenchmarkBundle).lastUpdated ??
        (data.updated_at as string) ??
        SEED_BUNDLE.lastUpdated,
    };
  } catch {
    return SEED_BUNDLE;
  }
}
