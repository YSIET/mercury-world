import { NextRequest, NextResponse } from "next/server";
import { setTotalCount } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { total?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const n = body.total;
  if (typeof n !== "number" || !Number.isFinite(n) || n < 0) {
    return NextResponse.json({ ok: false, error: "bad total" }, { status: 400 });
  }
  try {
    await setTotalCount(n);
  } catch {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
