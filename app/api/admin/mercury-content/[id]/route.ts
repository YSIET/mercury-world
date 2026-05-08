import { NextRequest, NextResponse } from "next/server";
import { deleteMercuryRow, updateMercuryRow } from "@/lib/mercury-content";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id?.trim()) {
    return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  try {
    const row = await updateMercuryRow(id.trim(), {
      ...(body.category !== undefined ? { category: String(body.category) } : {}),
      ...(body.foodName !== undefined ? { foodName: String(body.foodName) } : {}),
      ...(body.avgMgKg !== undefined ? { avgMgKg: Number(body.avgMgKg) } : {}),
      ...(body.rangeText !== undefined ? { rangeText: String(body.rangeText) } : {}),
      ...(body.sampleCount !== undefined
        ? { sampleCount: Number(body.sampleCount) }
        : {}),
      ...(body.analyzedAt !== undefined
        ? { analyzedAt: String(body.analyzedAt) }
        : {}),
      ...(body.note !== undefined ? { note: String(body.note) } : {}),
      ...(body.sourcePostId !== undefined
        ? { sourcePostId: String(body.sourcePostId) }
        : {}),
    });
    if (!row) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, row });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id?.trim()) {
    return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  }
  const ok = await deleteMercuryRow(id.trim());
  if (!ok) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
