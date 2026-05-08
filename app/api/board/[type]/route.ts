import { NextRequest, NextResponse } from "next/server";
import { getMergedBoardPage, isBoardType } from "@/lib/board";

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  if (!isBoardType(params.type)) {
    return NextResponse.json({ error: "bad type" }, { status: 400 });
  }
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const size = Math.min(
    50,
    Math.max(1, parseInt(sp.get("size") ?? "10", 10) || 10)
  );
  try {
    const result = await getMergedBoardPage(params.type, page, size);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
