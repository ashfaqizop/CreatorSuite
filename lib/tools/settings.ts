import "server-only";
import { getServerSupabase } from "@/lib/supabase/server";
import { TOOL_METAS } from "./index";
import type { ToolMeta } from "@/types";

/**
 * Returns tool metas with `enabled` overlaid from the `tool_settings` table so
 * the admin can toggle tools without a redeploy (§7). Falls back to the code
 * default when Supabase is not configured.
 */
export async function getToolMetasWithSettings(): Promise<ToolMeta[]> {
  const supabase = getServerSupabase();
  if (!supabase) return TOOL_METAS;

  try {
    const { data } = await supabase.from("tool_settings").select("slug, enabled");
    if (!data) return TOOL_METAS;
    const overrides = new Map(data.map((r) => [r.slug as string, r.enabled as boolean]));
    return TOOL_METAS.map((m) => ({
      ...m,
      enabled: overrides.has(m.slug) ? overrides.get(m.slug)! : m.enabled,
    }));
  } catch {
    return TOOL_METAS;
  }
}

export async function getEnabledToolMetas(): Promise<ToolMeta[]> {
  return (await getToolMetasWithSettings()).filter((m) => m.enabled);
}
