import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

const cookieClear = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 0,
  path: "/",
};

function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", cookieClear);
  return res;
}

export async function GET(req: NextRequest) {
  const target = safeRedirectPath(req.nextUrl.searchParams.get("redirect"));
  const res = NextResponse.redirect(new URL(target, req.url));
  res.cookies.set(ADMIN_COOKIE_NAME, "", cookieClear);
  return res;
}
