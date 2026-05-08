import { NextRequest, NextResponse } from "next/server";
import { getPostByUrlId, verifyPassword } from "@/lib/qna";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: Ctx) {
  const { id: idStr } = await context.params;
  const post = await getPostByUrlId(parseInt(idStr, 10));
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!post.isSecret) {
    return NextResponse.json({ content: post.content });
  }
  const { password } = await req.json();
  if (!password || !(await verifyPassword(password, post.passwordHash))) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  }
  return NextResponse.json({ content: post.content });
}
