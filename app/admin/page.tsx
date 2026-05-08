import Link from "next/link";
import { getBoardStats, getQnaStats, getTodayStats } from "@/lib/stats";

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
  const [board, qna, visit] = await Promise.all([
    getBoardStats(),
    getQnaStats(),
    getTodayStats(),
  ]);
  const roots = qna.totalPosts - qna.totalReplies;

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
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
        }}
      >
        <Link href="/admin/qna" className="admin-dash-card">
          <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 10 }}>
            묻고답하기
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: "#444" }}>
            글 {roots}건 / 답글 {qna.totalReplies}건 / 비밀글 {qna.secretCount}건
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#007bd1" }}>
            관리 →
          </div>
        </Link>

        <Link href="/admin/news/notice/write" className="admin-dash-card">
          <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 10 }}>
            공지사항
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: "#444" }}>
            총 {board.notice}건
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#007bd1" }}>
            글쓰기 →
          </div>
        </Link>

        <Link href="/admin/news/news/write" className="admin-dash-card">
          <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 10 }}>
            수은관련뉴스
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: "#444" }}>
            총 {board.news}건
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#007bd1" }}>
            글쓰기 →
          </div>
        </Link>

        <Link href="/admin/news/pds/write" className="admin-dash-card">
          <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 10 }}>
            수은함유량정보
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: "#444" }}>
            총 {board.pds}건
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#007bd1" }}>
            글쓰기 →
          </div>
        </Link>

        <Link href="/admin/stats" className="admin-dash-card">
          <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 10 }}>
            통계
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: "#444" }}>
            today {visit.today} / total {visit.total}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#007bd1" }}>
            방문 설정 →
          </div>
        </Link>
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: "#888", lineHeight: 1.6 }}>
        게시판 수는 KV 기준입니다. 묻고답하기(자유게시판) 총{" "}
        <strong>{board.freeboard}</strong>건(글+답글 포함).
      </p>
    </div>
  );
}
