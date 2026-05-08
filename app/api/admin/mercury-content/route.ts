import { NextRequest, NextResponse } from "next/server";
import {
  createMercuryRow,
  listMercuryRows,
} from "@/lib/mercury-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listMercuryRows();
  return NextResponse.json({ ok: true, rows });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  try {
    const row = await createMercuryRow({
      category: String(body.category ?? ""),
      foodName: String(body.foodName ?? ""),
      avgMgKg: Number(body.avgMgKg),
      rangeText: String(body.rangeText ?? ""),
      sampleCount: Number(body.sampleCount),
      analyzedAt: String(body.analyzedAt ?? ""),
      note: String(body.note ?? ""),
      sourcePostId: body.sourcePostId
        ? String(body.sourcePostId)
        : undefined,
    });
    return NextResponse.json({ ok: true, row });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 400 }
    );
  }
}
