import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function todayKST(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export async function GET() {
  const today = todayKST();
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
