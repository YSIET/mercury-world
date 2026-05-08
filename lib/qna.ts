import { kv } from "@vercel/kv";

export type QnaPost = {
  id: number;
  title: string;
  content: string;
  name: string;
  email?: string;
  passwordHash: string;
  createdAt: number;
  updatedAt: number;
  ip?: string;
};

const SALT = "mercury-qna-v1";

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest(
    "SHA-256",
    enc.encode(SALT + password)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return (await hashPassword(password)) === hash;
}

export async function nextPostId(): Promise<number> {
  return await kv.incr("qna:counter");
}

export async function savePost(post: QnaPost): Promise<void> {
  await kv.set(`qna:post:${post.id}`, post);
  await kv.zadd("qna:posts", {
    score: post.createdAt,
    member: String(post.id),
  });
}

export async function getPost(id: number): Promise<QnaPost | null> {
  return await kv.get<QnaPost>(`qna:post:${id}`);
}

export async function deletePostById(id: number): Promise<void> {
  await kv.del(`qna:post:${id}`);
  await kv.zrem("qna:posts", String(id));
}

export async function listPosts(
  offset: number,
  limit: number
): Promise<QnaPost[]> {
  const stop = offset + limit - 1;
  const raw = await kv.zrange<string[]>("qna:posts", offset, stop, {
    rev: true,
  });
  if (!raw?.length) return [];
  const posts = await Promise.all(raw.map((mid) => getPost(Number(mid))));
  return posts.filter((p): p is QnaPost => p !== null);
}

export async function countPosts(): Promise<number> {
  return (await kv.zcard("qna:posts")) ?? 0;
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `qna:rl:${ip}`;
  const exists = await kv.get(key);
  if (exists) return false;
  await kv.set(key, "1", { ex: 60 });
  return true;
}

export function stripPrivate(p: QnaPost) {
  const { passwordHash, ip, ...safe } = p;
  return safe;
}
