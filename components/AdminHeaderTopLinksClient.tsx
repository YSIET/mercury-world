"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

const linkStyle: CSSProperties = {
  color: "#888888",
  fontSize: 13,
  textDecoration: "none",
};

export default function AdminHeaderTopLinksClient() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session")
      .then((r) => (r.ok ? r.json() : { loggedIn: false }))
      .then((d: { loggedIn?: boolean }) => {
        if (!cancelled) setLoggedIn(Boolean(d.loggedIn));
      })
      .catch(() => {
        if (!cancelled) setLoggedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {" | "}
      {loggedIn === null ? (
        <span style={{ ...linkStyle, visibility: "hidden" }} aria-hidden>
          관리자 로그인
        </span>
      ) : !loggedIn ? (
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
