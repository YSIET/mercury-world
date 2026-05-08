import { NextRequest, NextResponse } from "next/server";
import {
  buildChildrenMap,
  collectSubtreeIds,
  getPost,
  listAllPosts,
  updateQnaPostFields,
} from "@/lib/qna";

export const dynamic = "force-dynamic";

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; replyId: string }> }
) {
  const { id: rootStr, replyId: replyStr } = await context.params;
  const rootId = parseInt(rootStr, 10);
  const replyId = parseInt(replyStr, 10);
  if (Number.isNaN(rootId) || Number.isNaN(replyId)) return bad("bad_id");
  if (replyId === rootId) {
    return bad("use root PATCH for 본문");
  }

  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }
  const content = body.content != null ? String(body.content).trim() : "";
  if (!content) return bad("content required");

  const reply = await getPost(replyId);
  if (!reply) return bad("not_found", 404);

  const all = await listAllPosts();
  const subtree = collectSubtreeIds(rootId, buildChildrenMap(all));
  if (!subtree.includes(replyId)) {
    return bad("reply not in thread", 404);
  }

  await updateQnaPostFields(replyId, { content });
  return NextResponse.json({ ok: true });
}
