import Link from "next/link";
import { listAllPosts } from "@/lib/qna";
import AdminQnaClient from "./AdminQnaClient";

export const dynamic = "force-dynamic";

async function logoutAction() {
  "use server";
  const { cookies } = await import("next/headers");
  const { redirect } = await import("next/navigation");
  const { ADMIN_COOKIE_NAME } = await import("@/lib/admin-auth");
  (await cookies()).set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  redirect("/admin/login");
}

export default async function AdminQnaListPage() {
  const posts = await listAllPosts();

  return (
    <div
      className="mw-fluid-rail mw-admin-rail"
      style={{
        width: 940,
        margin: "24px auto",
        fontFamily: "굴림, Gulim, sans-serif",
        fontSize: 14,
        color: "#333",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <Link href="/admin" style={{ fontSize: 13, color: "#666" }}>
            ← 대시보드
          </Link>
          <h1 style={{ fontSize: 18, margin: "8px 0 0" }}>묻고답하기 관리</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" style={{ fontSize: 13, padding: "6px 14px" }}>
            로그아웃
          </button>
        </form>
      </div>

      <AdminQnaClient initialPosts={posts} />
    </div>
  );
}
