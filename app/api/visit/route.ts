import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const INIT_TOTAL = 17322;
const FAKE_MIN = 1;
const FAKE_MAX = 5;

function todayKST(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET() {
  const today = todayKST();

  const initDone = await kv.get("visit:init_done");
  if (!initDone) {
    await kv.set("visit:total", INIT_TOTAL);
    await kv.set("visit:init_done", "1");
  }

  const lastFakeDate = await kv.get<string>("visit:last_fake_date");
  if (lastFakeDate !== today) {
    const fake = randInt(FAKE_MIN, FAKE_MAX);
    await Promise.all([
      kv.incrby("visit:total", fake),
      kv.incrby(`visit:today:${today}`, fake),
    ]);
    await kv.set("visit:last_fake_date", today);
  }

  const cookieStore = cookies();
  const lastVisit = cookieStore.get("last_visit_date")?.value;
  let counted = false;
  if (lastVisit !== today) {
    await Promise.all([
      kv.incr("visit:total"),
      kv.incr(`visit:today:${today}`),
    ]);
    counted = true;
  }

  const [total, todayCount] = await Promise.all([
    kv.get<number>("visit:total"),
    kv.get<number>(`visit:today:${today}`),
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
