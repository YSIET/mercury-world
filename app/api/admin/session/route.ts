import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

/** Public read-only session check for client header (httpOnly cookie). */
export async function GET() {
  const jar = await cookies();
  const loggedIn = await verifySessionToken(jar.get(ADMIN_COOKIE_NAME)?.value);
  return NextResponse.json({ loggedIn });
}
