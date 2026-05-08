import { kv } from "@vercel/kv";

const PREFIX = "blob:file:";

export type FileBlobRecord = {
  name: string;
  contentType: string;
  size: number;
  b64: string;
};

export async function putFileBlob(r: FileBlobRecord): Promise<string> {
  const id = crypto.randomUUID();
  await kv.set(`${PREFIX}${id}`, JSON.stringify(r));
  return id;
}

export async function getFileBlob(
  id: string
): Promise<FileBlobRecord | null> {
  const s = await kv.get<string>(`${PREFIX}${id}`);
  if (!s) return null;
  try {
    return JSON.parse(s) as FileBlobRecord;
  } catch {
    return null;
  }
}
