import { NextRequest, NextResponse } from "next/server";
import {
  deletePostTree,
  getPost,
  updateQnaPostFields,
} from "@/lib/qna";

export const dynamic = "force-dynamic";

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await context.params;
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) return bad("bad_id");

  let body: { title?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }
  const title = body.title !== undefined ? String(body.title) : undefined;
  const content = body.content !== undefined ? String(body.content) : undefined;
  if (title === undefined && content === undefined) {
    return bad("title or content required");
  }
  const cur = await getPost(id);
  if (!cur) return bad("not_found", 404);
  const patch: Partial<{ title: string; content: string }> = {};
  if (title !== undefined) {
    const t = title.trim();
    if (!t) return bad("empty title");
    patch.title = t;
  }
  if (content !== undefined) {
    const c = content.trim();
    if (!c) return bad("empty content");
    patch.content = c;
  }
  await updateQnaPostFields(id, patch);
  return NextResponse.json({ ok: true });
}

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
