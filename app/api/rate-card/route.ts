import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

// Saved Rate Card — curated set of pinned estimates (§10.2).

export async function GET() {
  const session = await auth();
  const supabase = getServerSupabase();
  if (!session?.user?.id || !supabase) {
    return NextResponse.json({ pinned_estimate_ids: [] });
  }
  const { data } = await supabase
    .from("rate_card")
    .select("pinned_estimate_ids")
    .eq("user_id", session.user.id)
    .maybeSingle();
  return NextResponse.json({
    pinned_estimate_ids: data?.pinned_estimate_ids ?? [],
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  const supabase = getServerSupabase();
  if (!session?.user?.id || !supabase) {
    return new NextResponse(null, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.pinned_estimate_ids)
    ? body.pinned_estimate_ids
    : [];

  const { error } = await supabase.from("rate_card").upsert(
    {
      user_id: session.user.id,
      pinned_estimate_ids: ids,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pinned_estimate_ids: ids });
}
