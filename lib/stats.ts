import { kv } from "@vercel/kv";
import { getPostsByBoard } from "@/lib/posts";
import { listAllPosts, countPosts } from "@/lib/qna";
import {
  todayKST,
  visitTodayKey,
  KV_VISIT_TOTAL,
  KV_VISIT_FAKE_MIN,
  KV_VISIT_FAKE_MAX,
  getFakeDailyRange,
} from "@/lib/today";
import type { BoardType } from "@/lib/board";

export type BoardBucketStats = {
  kv: number;
  legacy: number;
};

export type BoardStatsMap = {
  notice: BoardBucketStats;
  news: BoardBucketStats;
  pds: BoardBucketStats;
  freeboard: BoardBucketStats;
};

export type QnaStats = {
  totalPosts: number;
  totalReplies: number;
  secretCount: number;
};

export type DailyHistoryRow = { date: string; count: number };

export type TodayStatsBundle = {
  today: number;
  total: number;
  fakeRange: { min: number; max: number };
  dailyHistory: DailyHistoryRow[];
};

function boardZkey(type: BoardType): string {
  return `board:${type}:posts`;
}

/** KST 기준 오늘부터 과거 29일까지(30일치) 방문 키 조회 */
async function loadDailyHistoryLast30(): Promise<DailyHistoryRow[]> {
  const rows: DailyHistoryRow[] = [];
  for (let i = 0; i < 30; i++) {
    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000 - i * 86400000);
    const ymd = kst.toISOString().slice(0, 10);
    rows.push({ date: ymd, count: 0 });
  }
  const vals = await Promise.all(
    rows.map((r) => kv.get<number | string>(visitTodayKey(r.date)))
  );
  return rows.map((r, i) => {
    const v = vals[i];
    const n = v != null ? Number(v) : 0;
    return { date: r.date, count: Number.isFinite(n) ? n : 0 };
  });
}

export async function getBoardStats(): Promise<BoardStatsMap> {
  const [nKv, wKv, pKv, fbKvCount] = await Promise.all([
    kv.zcard(boardZkey("notice")),
    kv.zcard(boardZkey("news")),
    kv.zcard(boardZkey("pds")),
    countPosts(),
  ]);
  return {
    notice: { kv: nKv ?? 0, legacy: getPostsByBoard("notice").length },
    news: { kv: wKv ?? 0, legacy: getPostsByBoard("news").length },
    pds: { kv: pKv ?? 0, legacy: getPostsByBoard("pds").length },
    freeboard: { kv: fbKvCount ?? 0, legacy: getPostsByBoard("freeboard").length },
  };
}

export async function getQnaStats(): Promise<QnaStats> {
  const posts = await listAllPosts();
  const totalPosts = posts.length;
  const totalReplies = posts.filter((p) => p.parentId != null).length;
  const secretCount = posts.filter((p) => p.isSecret).length;
  return { totalPosts, totalReplies, secretCount };
}

export async function getTodayStats(): Promise<TodayStatsBundle> {
  const today = todayKST();
  const [total, todayCount, fakeRange, dailyHistory] = await Promise.all([
    kv.get<number>(KV_VISIT_TOTAL),
    kv.get<number>(visitTodayKey(today)),
    getFakeDailyRange(),
    loadDailyHistoryLast30(),
  ]);
  return {
    today: todayCount ?? 0,
    total: total ?? 0,
    fakeRange,
    dailyHistory,
  };
}

export async function setTodayCount(n: number): Promise<void> {
  if (!Number.isFinite(n) || n < 0) throw new Error("invalid today");
  const today = todayKST();
  await kv.set(visitTodayKey(today), Math.floor(n));
}

export async function setTotalCount(n: number): Promise<void> {
  if (!Number.isFinite(n) || n < 0) throw new Error("invalid total");
  await kv.set(KV_VISIT_TOTAL, Math.floor(n));
}

export async function setFakeDailyRange(
  min: number,
  max: number
): Promise<void> {
  let a = Math.floor(min);
  let b = Math.floor(max);
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("invalid range");
  if (a < 0) a = 0;
  if (b < 0) b = 0;
  if (a > b) {
    const t = a;
    a = b;
    b = t;
  }
  if (b > 1_000_000) b = 1_000_000;
  await Promise.all([
    kv.set(KV_VISIT_FAKE_MIN, a),
    kv.set(KV_VISIT_FAKE_MAX, b),
  ]);
}
