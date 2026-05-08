import { NextRequest, NextResponse } from "next/server";
import {
  createBoardPost,
  deleteKvPost,
  getKvPost,
  isBoardType,
  updateBoardPost,
  type BoardAttachment,
  type BoardType,
} from "@/lib/board";

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("invalid json");
  }
  const b = body as {
    type?: string;
    title?: string;
    content?: string;
    author?: string;
    attachments?: BoardAttachment[];
  };
  if (!isBoardType(b.type ?? "")) return bad("bad type");
  const type = b.type as BoardType;
  const title = (b.title ?? "").trim();
  const content = (b.content ?? "").trim();
  if (!title || !content) return bad("title and content required");
  const post = await createBoardPost({
    type,
    title,
    content,
    author: b.author,
    attachments: Array.isArray(b.attachments) ? b.attachments : undefined,
  });
  return NextResponse.json({ ok: true, id: post.id });
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("invalid json");
  }
  const b = body as {
    type?: string;
    id?: string;
    title?: string;
    content?: string;
    author?: string;
    attachments?: BoardAttachment[];
  };
  if (!isBoardType(b.type ?? "")) return bad("bad type");
  const type = b.type as BoardType;
  const id = (b.id ?? "").trim();
  if (!id) return bad("id required");
  const title = (b.title ?? "").trim();
  const content = (b.content ?? "").trim();
  if (!title || !content) return bad("title and content required");
  const patch: Parameters<typeof updateBoardPost>[2] = { title, content };
  if (b.author !== undefined) {
    patch.author = String(b.author).trim() || "수은세상";
  }
  if (Array.isArray(b.attachments)) {
    patch.attachments =
      b.attachments.length === 0 ? undefined : b.attachments;
  }
  const cur = await updateBoardPost(type, id, patch);
  if (!cur) return bad("not found", 404);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("invalid json");
  }
  const b = body as { type?: string; id?: string };
  if (!isBoardType(b.type ?? "")) return bad("bad type");
  const type = b.type as BoardType;
  const id = (b.id ?? "").trim();
  if (!id) return bad("id required");
  const existing = await getKvPost(type, id);
  if (!existing) return bad("not found", 404);
  await deleteKvPost(type, id);
  return NextResponse.json({ ok: true });
}
