import { kv } from "@vercel/kv";

/** KST 날짜 키 (api/visit와 동일) */
export function todayKST(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export const VISIT_INIT_TOTAL = 17322;

export const KV_VISIT_TOTAL = "visit:total";
export const KV_VISIT_INIT_DONE = "visit:init_done";
export const KV_VISIT_LAST_FAKE_DATE = "visit:last_fake_date";
export const KV_VISIT_FAKE_MIN = "visit:fake_min";
export const KV_VISIT_FAKE_MAX = "visit:fake_max";

export function visitTodayKey(ymd: string): string {
  return `visit:today:${ymd}`;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** KV 미설정 시 1–5 (기존 하드코드와 동일) */
export async function getFakeDailyRange(): Promise<{ min: number; max: number }> {
  const [a, b] = await Promise.all([
    kv.get<string | number>(KV_VISIT_FAKE_MIN),
    kv.get<string | number>(KV_VISIT_FAKE_MAX),
  ]);
  let min = a != null ? Number(a) : 1;
  let max = b != null ? Number(b) : 5;
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 1;
    max = 5;
  }
  if (min > max) {
    const t = min;
    min = max;
    max = t;
  }
  if (min < 0) min = 0;
  return { min, max };
}
