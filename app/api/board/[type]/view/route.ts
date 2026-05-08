import { NextRequest, NextResponse } from "next/server";
import {
  incrementKvPostView,
  isBoardType,
  type BoardType,
} from "@/lib/board";

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  if (!isBoardType(params.type)) {
    return NextResponse.json({ error: "bad type" }, { status: 400 });
  }
  const type = params.type as BoardType;
  let body: { kvPostId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const kvPostId = (body.kvPostId ?? "").trim();
  if (!kvPostId) {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const cookieName = `boardv_${type}_${encodeURIComponent(kvPostId)}`;
  if (req.cookies.get(cookieName)?.value) {
    return NextResponse.json({ ok: true, counted: false });
  }
  await incrementKvPostView(type, kvPostId);
  const res = NextResponse.json({ ok: true, counted: true });
  res.cookies.set(cookieName, "1", {
    maxAge: 3600,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
