import { NextRequest, NextResponse } from "next/server";
import {
  getPost,
  savePost,
  deletePostById,
  verifyPassword,
  stripPrivate,
} from "@/lib/qna";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const id = parseInt(params.id, 10);
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(stripPrivate(post));
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const id = parseInt(params.id, 10);
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { title, content, password } = await req.json();
  if (!title?.trim() || !content?.trim() || !password) {
    return NextResponse.json(
      { error: "필수 항목을 모두 입력해 주세요." },
      { status: 400 }
    );
  }
  if (!(await verifyPassword(password, post.passwordHash))) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  }
  post.title = title.trim();
  post.content = content.trim();
  post.updatedAt = Date.now();
  await savePost(post);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const id = parseInt(params.id, 10);
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { password } = await req.json();
  if (!password || !(await verifyPassword(password, post.passwordHash))) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  }
  await deletePostById(id);
  return NextResponse.json({ ok: true });
}
