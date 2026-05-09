import { kv } from "@vercel/kv";
import { formatDate } from "@/lib/post-utils";

export type BoardType = "notice" | "news" | "pds";

const BOARD_TYPES: BoardType[] = ["notice", "news", "pds"];

export function isBoardType(s: string): s is BoardType {
  return (BOARD_TYPES as string[]).includes(s);
}

export function boardTypeToSlug(t: BoardType): "notice" | "news" | "pds" {
  return t;
}

export function listPathForBoardType(t: BoardType): string {
  const m: Record<BoardType, string> = {
    notice: "/news/board",
    news: "/news/news",
    pds: "/news/pds",
  };
  return m[t];
}

/** 본문 H1 · 브레드크럼 꼬리 · document title — 사이드바(Header MENU)와 동일 문구 (cafe24 news) */
export const BOARD_SECTION_HEADING: Record<BoardType, string> = {
  notice: "공지사항",
  news: "수은관련뉴스",
  pds: "수은함유량정보",
};

export function boardSectionHeading(t: BoardType): string {
  return BOARD_SECTION_HEADING[t];
}

export const BOARD_TITLE_IMG: Record<BoardType, string> = {
  notice: "/img/news/title_5.gif",
  news: "/img/news/title_1.gif",
  pds: "/img/news/title_3.gif",
};

/** Legacy attachment bucket id (attachments.json / public/upload) — 마이그레이션·레거시 경로용 주석만 유지 */
export function attachmentBoardIdForType(t: BoardType): string | null {
  if (t === "news") return "board_news2";
  if (t === "pds") return "pds";
  return null;
}

export interface BoardAttachment {
  name: string;
  url: string;
  size?: number;
}

export interface BoardPost {
  id: string;
  type: BoardType;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  attachments?: BoardAttachment[];
  isNotice?: boolean;
}

export type BoardListRow = {
  key: string;
  listId: string;
  title: string;
  author: string;
  dateStr: string;
  displayHits: number;
  sortTime: number;
  isNotice: boolean;
};

/** 목록/URL용 id — `legacy:123` → `123` */
export function publicBoardListId(p: BoardPost): string {
  if (p.id.startsWith("legacy:")) return p.id.slice(7);
  return p.id;
}

function zkey(type: BoardType) {
  return `board:${type}:posts`;
}

function pkey(type: BoardType, id: string) {
  return `board:${type}:post:${id}`;
}

function legacyViewKey(type: BoardType, bdNo: number) {
  return `board:legacyviews:${type}:${bdNo}`;
}

export async function getLegacyViewExtra(
  type: BoardType,
  bdNo: number
): Promise<number> {
  const v = await kv.get<string>(legacyViewKey(type, bdNo));
  const n = v ? parseInt(v, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function incrementLegacyView(
  type: BoardType,
  bdNo: number
): Promise<void> {
  await kv.incr(legacyViewKey(type, bdNo));
}

export async function incrementKvPostView(
  type: BoardType,
  id: string
): Promise<void> {
  const p = await getKvPost(type, id);
  if (!p) return;
  const next: BoardPost = { ...p, views: (p.views ?? 0) + 1 };
  await kv.set(pkey(type, id), next);
}

export async function getKvPost(
  type: BoardType,
  id: string
): Promise<BoardPost | null> {
  const p = await kv.get<BoardPost>(pkey(type, id));
  if (!p) return null;
  return {
    ...p,
    views: p.views ?? 0,
  };
}

export async function listAllKvBoardPosts(
  type: BoardType
): Promise<BoardPost[]> {
  const ids = await kv.zrange<string[]>(zkey(type), 0, -1, { rev: true });
  if (!ids?.length) return [];
  const posts = await Promise.all(ids.map((mid) => getKvPost(type, mid)));
  return posts.filter((p): p is BoardPost => p !== null);
}

export async function getRecentBoardLinks(
  type: BoardType,
  limit: number
): Promise<{ title: string; href: string; date: string }[]> {
  const posts = await listAllKvBoardPosts(type);
  const base = listPathForBoardType(type);
  return posts.slice(0, limit).map((p) => ({
    title: p.title,
    href: `${base}/${publicBoardListId(p)}`,
    date: formatDate(p.createdAt),
  }));
}

export async function saveNewKvPost(post: BoardPost): Promise<void> {
  await kv.set(pkey(post.type, post.id), post);
  const score = Date.parse(post.createdAt);
  await kv.zadd(zkey(post.type), { score, member: post.id });
}

export async function updateKvPostRecord(post: BoardPost): Promise<void> {
  await kv.set(pkey(post.type, post.id), post);
}

export async function deleteKvPost(type: BoardType, id: string): Promise<void> {
  await kv.del(pkey(type, id));
  await kv.zrem(zkey(type), id);
}

export async function createBoardPost(input: {
  type: BoardType;
  title: string;
  content: string;
  author?: string;
  attachments?: BoardAttachment[];
}): Promise<BoardPost> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const post: BoardPost = {
    id,
    type: input.type,
    title: input.title,
    content: input.content,
    author: input.author?.trim() || "수은세상",
    createdAt: now,
    updatedAt: now,
    views: 0,
    attachments: input.attachments?.length ? input.attachments : undefined,
  };
  await saveNewKvPost(post);
  return post;
}

export async function updateBoardPost(
  type: BoardType,
  id: string,
  patch: Partial<
    Pick<BoardPost, "title" | "content" | "author" | "attachments">
  >
): Promise<BoardPost | null> {
  const cur = await getKvPost(type, id);
  if (!cur) return null;
  const now = new Date().toISOString();
  const next: BoardPost = {
    ...cur,
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.content !== undefined ? { content: patch.content } : {}),
    ...(patch.author !== undefined ? { author: patch.author } : {}),
    ...(patch.attachments !== undefined
      ? { attachments: patch.attachments }
      : {}),
    updatedAt: now,
  };
  await updateKvPostRecord(next);
  return next;
}

async function buildBoardListRows(type: BoardType): Promise<BoardListRow[]> {
  const kvPosts = await listAllKvBoardPosts(type);
  return kvPosts.map((p) => ({
    key: `k-${p.id}`,
    listId: publicBoardListId(p),
    title: p.title,
    author: p.author,
    dateStr: formatDate(p.createdAt),
    displayHits: p.views,
    sortTime: Date.parse(p.createdAt),
    isNotice: p.isNotice ?? false,
  }));
}

export async function mergeBoardListRows(
  type: BoardType
): Promise<BoardListRow[]> {
  const rows = await buildBoardListRows(type);
  return [...rows].sort((a, b) => b.sortTime - a.sortTime);
}

export async function getMergedBoardPage(
  type: BoardType,
  page: number,
  pageSize: number
): Promise<{
  rows: BoardListRow[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const all = await mergeBoardListRows(type);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), totalPages);
  const start = (p - 1) * pageSize;
  const rows = all.slice(start, start + pageSize);
  return { rows, total, page: p, totalPages };
}

export type ResolvedBoardPost = {
  post: BoardPost;
  displayHits: number;
};

export async function resolveBoardPost(
  type: BoardType,
  id: string
): Promise<ResolvedBoardPost | null> {
  if (/^\d+$/.test(id)) {
    const bd = parseInt(id, 10);
    const kvLegacy = await getKvPost(type, `legacy:${bd}`);
    if (kvLegacy) {
      return { post: kvLegacy, displayHits: kvLegacy.views };
    }
  }
  const kv = await getKvPost(type, id);
  if (kv) return { post: kv, displayHits: kv.views };
  return null;
}

export async function getBoardNeighbors(
  type: BoardType,
  publicListId: string
): Promise<{ prev?: { href: string }; next?: { href: string } }> {
  const merged = await mergeBoardListRows(type);
  const listBase = listPathForBoardType(type);
  const idx = merged.findIndex((r) => r.listId === publicListId);
  if (idx < 0) return {};
  const older = merged[idx + 1];
  const newer = merged[idx - 1];
  return {
    prev: older ? { href: `${listBase}/${older.listId}` } : undefined,
    next: newer ? { href: `${listBase}/${newer.listId}` } : undefined,
  };
}

/** @deprecated Sprint 21+ — use BoardListRow */
export type MergedBoardListRow = BoardListRow;
