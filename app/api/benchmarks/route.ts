import { NextResponse } from "next/server";
import { getBenchmarks } from "@/lib/benchmarks/getBenchmarks";

// Edge-cached benchmark serving (§2.6).
export const revalidate = 3600;

export async function GET() {
  const bundle = await getBenchmarks();
  return NextResponse.json(bundle, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
