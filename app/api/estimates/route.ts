import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase/server";

// Signed-in estimate history (§10.2).

export async function GET() {
  const session = await auth();
  const supabase = getServerSupabase();
  if (!session?.user?.id || !supabase) {
    return NextResponse.json({ estimates: [] });
  }
  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ estimates: [], error: error.message });
  return NextResponse.json({ estimates: data ?? [] });
}

export async function POST(req: Request) {
  const session = await auth();
  const supabase = getServerSupabase();
  // Anonymous users persist via localStorage only — silently no-op (§10.1).
  if (!session?.user?.id || !supabase) {
    return new NextResponse(null, { status: 204 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.tool_slug) {
    return NextResponse.json({ error: "tool_slug required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("estimates")
    .insert({
      user_id: session.user.id,
      tool_slug: body.tool_slug,
      inputs_json: body.inputs_json ?? {},
      results_json: body.results_json ?? {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ estimate: data }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  const supabase = getServerSupabase();
  if (!session?.user?.id || !supabase) {
    return new NextResponse(null, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("estimates")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
