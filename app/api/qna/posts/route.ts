import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  savePost,
  listPosts,
  countPosts,
  checkRateLimit,
  nextPostId,
  stripPrivate,
  type QnaPost,
} from "@/lib/qna";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const size = Math.min(
    1000,
    Math.max(1, parseInt(searchParams.get("size") ?? "1000", 10))
  );
  const offset = (page - 1) * size;
  const [posts, total] = await Promise.all([
    listPosts(offset, size),
    countPosts(),
  ]);
  return NextResponse.json({
    posts: posts.map(stripPrivate),
    total,
    page,
    size,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, name, password, email, website } = body;

  if (website) return NextResponse.json({ error: "spam" }, { status: 400 });
  if (!title?.trim() || !content?.trim() || !name?.trim() || !password) {
    return NextResponse.json(
      { error: "필수 항목을 모두 입력해 주세요." },
      { status: 400 }
    );
  }
  if (password.length < 4) {
    return NextResponse.json(
      { error: "비밀번호는 4자 이상이어야 합니다." },
      { status: 400 }
    );
  }
  if (title.length > 200 || content.length > 50000 || name.length > 50) {
    return NextResponse.json(
      { error: "입력 길이가 초과되었습니다." },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json(
      { error: "잠시 후 다시 시도해 주세요. (1분에 1개)" },
      { status: 429 }
    );
  }

  const id = await nextPostId();
  const now = Date.now();
  const post: QnaPost = {
    id,
    title: title.trim(),
    content: content.trim(),
    name: name.trim(),
    email: email?.trim() || undefined,
    passwordHash: await hashPassword(password),
    createdAt: now,
    updatedAt: now,
    ip,
  };
  await savePost(post);
  return NextResponse.json({ id, ok: true });
}
