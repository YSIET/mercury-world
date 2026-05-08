import { NextRequest, NextResponse } from "next/server";
import { putFileBlob } from "@/lib/kv-file-blob";

export const runtime = "nodejs";

const MAX_BYTES = 1024 * 1024;

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid form" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "too large (max 1MB)" },
      { status: 400 }
    );
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.replace(/[\r\n\0]/g, "").slice(0, 240) || "file";
  const id = await putFileBlob({
    name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
    b64: buf.toString("base64"),
  });
  const url = `/api/attachments/file?id=${encodeURIComponent(id)}`;
  return NextResponse.json({
    ok: true,
    name: file.name,
    url,
    size: file.size,
  });
}
