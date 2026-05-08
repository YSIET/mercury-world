import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_DAYS,
  createSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";

function clientIp(h: Headers): string {
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const lockKey = `admin:lock:${ip}`;
  if (await kv.get(lockKey)) {
    return NextResponse.json({ ok: false, error: "locked" }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const password = body.password ?? "";
  const ok = verifyPassword(password);
  const failKey = `admin:rl:fail:${ip}`;

  if (!ok) {
    const fails = await kv.incr(failKey);
    if (fails === 1) await kv.expire(failKey, 300);
    if (fails >= 5) {
      await kv.set(lockKey, "1", { ex: 300 });
      await kv.del(failKey);
      return NextResponse.json({ ok: false, error: "locked" }, { status: 429 });
    }
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  await kv.del(failKey);

  let token: string;
  try {
    token = await createSessionToken();
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_misconfig" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
  return res;
}
