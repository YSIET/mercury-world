import { NextRequest, NextResponse } from "next/server";
import { setFakeDailyRange } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { min?: number; max?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const { min, max } = body;
  if (typeof min !== "number" || typeof max !== "number") {
    return NextResponse.json({ ok: false, error: "bad range" }, { status: 400 });
  }
  try {
    await setFakeDailyRange(min, max);
  } catch {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
