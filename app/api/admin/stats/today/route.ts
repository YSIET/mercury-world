import { NextRequest, NextResponse } from "next/server";
import { setTodayCount } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { today?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const n = body.today;
  if (typeof n !== "number" || !Number.isFinite(n) || n < 0) {
    return NextResponse.json({ ok: false, error: "bad today" }, { status: 400 });
  }
  try {
    await setTodayCount(n);
  } catch {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
