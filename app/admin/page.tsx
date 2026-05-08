import Link from "next/link";
import { listAllPosts } from "@/lib/qna";

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

export default async function AdminDashboardPage() {
  const posts = await listAllPosts();
  const roots = posts.filter((p) => p.parentId == null).length;
  const replies = posts.filter((p) => p.parentId != null).length;
  const secrets = posts.filter((p) => p.isSecret).length;

  return (
    <div
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
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 18, margin: 0 }}>관리자 대시보드</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{ fontSize: 13, padding: "6px 14px", cursor: "pointer" }}
          >
            로그아웃
          </button>
        </form>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <Link
          href="/admin/qna"
          style={{
            display: "block",
            padding: 20,
            border: "1px solid #ccc",
            background: "#fff",
            textDecoration: "none",
            color: "#333",
            borderRadius: 4,
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 12 }}>
            묻고답하기 관리
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "#555" }}>
            전체 글 {posts.length}건 (원글 {roots} / 답글 {replies}) · 비밀글{" "}
            {secrets}건
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#007bd1" }}>
            목록 보기 →
          </div>
        </Link>
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: "#888" }}>
        통계는 묻고답하기 KV 기준입니다.
      </p>
    </div>
  );
}
