import { kv } from "@vercel/kv";

export type QnaPost = {
  id: number;
  parentId?: number;
  rootId?: number;
  depth: number;
  title: string;
  content: string;
  name: string;
  email?: string;
  passwordHash: string;
  isSecret: boolean;
  createdAt: number;
  updatedAt: number;
  ip?: string;
};

export type QnaPostListItem = Omit<
  QnaPost,
  "passwordHash" | "ip" | "content"
>;

const SALT = "mercury-qna-v1";

export const MAX_DEPTH = 5;

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
  const post = await kv.get<QnaPost>(`qna:post:${id}`);
  if (!post) return null;
  return {
    ...post,
    depth: post.depth ?? 0,
    isSecret: post.isSecret ?? false,
  };
}

export async function createReplyMeta(
  parentId: number
): Promise<{ parentId: number; rootId: number; depth: number } | null> {
  const parent = await getPost(parentId);
  if (!parent) return null;
  const newDepth = (parent.depth ?? 0) + 1;
  if (newDepth > MAX_DEPTH) return null;
  return {
    parentId: parent.id,
    rootId: parent.rootId ?? parent.id,
    depth: newDepth,
  };
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

/** 전체 글 (admin 목록용, zset 순서: createdAt 내림차순) */
export async function listAllPosts(): Promise<QnaPost[]> {
  const raw = await kv.zrange<string[]>("qna:posts", 0, -1, { rev: true });
  if (!raw?.length) return [];
  const posts = await Promise.all(raw.map((mid) => getPost(Number(mid))));
  return posts.filter((p): p is QnaPost => p !== null);
}

export function buildChildrenMap(posts: QnaPost[]): Map<number, number[]> {
  const m = new Map<number, number[]>();
  for (const p of posts) {
    if (p.parentId == null) continue;
    if (!m.has(p.parentId)) m.set(p.parentId, []);
    m.get(p.parentId)!.push(p.id);
  }
  for (const [, arr] of m) {
    arr.sort((a, b) => a - b);
  }
  return m;
}

/** rootId 기준: 해당 글 + 모든 하위 답글 id (DFS) */
export function collectSubtreeIds(
  postId: number,
  childrenMap: Map<number, number[]>
): number[] {
  const out: number[] = [];
  const stack = [postId];
  while (stack.length) {
    const id = stack.pop()!;
    out.push(id);
    for (const c of childrenMap.get(id) ?? []) stack.push(c);
  }
  return out;
}

/** 글과 모든 답글 삭제 (KV + zset). 삭제된 id 목록 반환 */
export async function deletePostTree(postId: number): Promise<number[]> {
  const posts = await listAllPosts();
  const childrenMap = buildChildrenMap(posts);
  const ids = collectSubtreeIds(postId, childrenMap);
  for (const id of ids) {
    await deletePostById(id);
  }
  return ids;
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

export function stripForList(p: QnaPost): QnaPostListItem {
  const { passwordHash, ip, content, ...safe } = p;
  return safe;
}
