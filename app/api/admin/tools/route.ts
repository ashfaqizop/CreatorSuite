import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";
import { getServerSupabase } from "@/lib/supabase/server";
import { getToolMetasWithSettings } from "@/lib/tools/settings";

export async function GET() {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json({ tools: await getToolMetasWithSettings() });
}

export async function PUT(req: Request) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.slug || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "slug and enabled required" }, { status: 400 });
  }
  const { error } = await supabase
    .from("tool_settings")
    .upsert(
      { slug: body.slug, enabled: body.enabled, updated_at: new Date().toISOString() },
      { onConflict: "slug" },
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
