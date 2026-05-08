import { NextRequest, NextResponse } from "next/server";
import { deletePostTree } from "@/lib/qna";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await context.params;
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }
  const deleted = await deletePostTree(id);
  console.log(
    `[admin] deletePostTree id=${id} count=${deleted.length}`,
    deleted.join(",")
  );
  return NextResponse.json({ ok: true, deleted: deleted.length });
}
