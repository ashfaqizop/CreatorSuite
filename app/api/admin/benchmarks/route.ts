import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";
import { getServerSupabase } from "@/lib/supabase/server";
import { getBenchmarks } from "@/lib/benchmarks/getBenchmarks";

export async function GET() {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json(await getBenchmarks());
}

export async function PUT(req: Request) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }
  const bundle = await req.json().catch(() => null);
  if (!bundle || typeof bundle !== "object") {
    return NextResponse.json({ error: "invalid bundle" }, { status: 400 });
  }
  bundle.lastUpdated = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("benchmarks")
    .upsert(
      { id: 1, bundle, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, lastUpdated: bundle.lastUpdated });
}
