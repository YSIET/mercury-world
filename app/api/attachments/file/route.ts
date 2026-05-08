import { NextRequest } from "next/server";
import { getFileBlob } from "@/lib/kv-file-blob";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return new Response("Bad Request", { status: 400 });
  }
  const rec = await getFileBlob(id);
  if (!rec) {
    return new Response("Not Found", { status: 404 });
  }
  const bin = Buffer.from(rec.b64, "base64");
  const filename = encodeURIComponent(rec.name).replace(/['()*]/g, (c) => "%" + c.charCodeAt(0).toString(16));
  return new Response(bin, {
    status: 200,
    headers: {
      "Content-Type": rec.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
