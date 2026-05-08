import Link from "next/link";
import type { CSSProperties } from "react";
import { isAdminFromCookies } from "@/lib/admin-auth-server";

const linkStyle: CSSProperties = {
  color: "#888888",
  fontSize: 13,
  textDecoration: "none",
};

export default async function AdminHeaderTopLinks() {
  const authed = await isAdminFromCookies();
  return (
    <>
      {" | "}
      {!authed ? (
        <Link href="/admin/login" style={linkStyle}>
          관리자 로그인
        </Link>
      ) : (
        <>
          <Link href="/admin" style={linkStyle}>
            관리자
          </Link>
          {" | "}
          <Link href="/api/admin/logout?redirect=/" style={linkStyle}>
            로그아웃
          </Link>
        </>
      )}
    </>
  );
}
