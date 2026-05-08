import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getFakeDailyRange,
  randInt,
  todayKST,
  VISIT_INIT_TOTAL,
  KV_VISIT_INIT_DONE,
  KV_VISIT_TOTAL,
  KV_VISIT_LAST_FAKE_DATE,
  visitTodayKey,
} from "@/lib/today";

export const dynamic = "force-dynamic";

export async function GET() {
  const today = todayKST();

  const initDone = await kv.get(KV_VISIT_INIT_DONE);
  if (!initDone) {
    await kv.set(KV_VISIT_TOTAL, VISIT_INIT_TOTAL);
    await kv.set(KV_VISIT_INIT_DONE, "1");
  }

  const lastFakeDate = await kv.get<string>(KV_VISIT_LAST_FAKE_DATE);
  if (lastFakeDate !== today) {
    const { min, max } = await getFakeDailyRange();
    const fake = randInt(min, max);
    await Promise.all([
      kv.incrby(KV_VISIT_TOTAL, fake),
      kv.incrby(visitTodayKey(today), fake),
    ]);
    await kv.set(KV_VISIT_LAST_FAKE_DATE, today);
  }

  const cookieStore = cookies();
  const lastVisit = cookieStore.get("last_visit_date")?.value;
  let counted = false;
  if (lastVisit !== today) {
    await Promise.all([
      kv.incr(KV_VISIT_TOTAL),
      kv.incr(visitTodayKey(today)),
    ]);
    counted = true;
  }

  const [total, todayCount] = await Promise.all([
    kv.get<number>(KV_VISIT_TOTAL),
    kv.get<number>(visitTodayKey(today)),
  ]);

  const res = NextResponse.json({
    total: total ?? 0,
    today: todayCount ?? 0,
    counted,
  });

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const nextMidnightUtc = new Date(
    Date.UTC(
      kst.getUTCFullYear(),
      kst.getUTCMonth(),
      kst.getUTCDate() + 1,
      -9,
      0,
      0
    )
  );
  res.cookies.set("last_visit_date", today, {
    expires: nextMidnightUtc,
    path: "/",
    sameSite: "lax",
  });

  return res;
}
