import { NextRequest, NextResponse } from "next/server";
import {
  incrementKvPostView,
  incrementLegacyView,
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
  let body: { listId?: string; source?: "json" | "kv" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const listId = (body.listId ?? "").trim();
  const source = body.source;
  if (!listId || (source !== "json" && source !== "kv")) {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const cookieName = `boardv_${type}_${listId}`;
  if (req.cookies.get(cookieName)?.value) {
    return NextResponse.json({ ok: true, counted: false });
  }
  if (source === "json") {
    const bd = parseInt(listId, 10);
    if (!Number.isFinite(bd)) {
      return NextResponse.json({ error: "bad listId" }, { status: 400 });
    }
    await incrementLegacyView(type, bd);
  } else {
    await incrementKvPostView(type, listId);
  }
  const res = NextResponse.json({ ok: true, counted: true });
  res.cookies.set(cookieName, "1", {
    maxAge: 3600,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
