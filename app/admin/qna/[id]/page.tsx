import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPost,
  listAllPosts,
  buildChildrenMap,
  collectSubtreeIds,
  type QnaPost,
} from "@/lib/qna";
import AdminQnaDeleteBtn from "../AdminQnaDeleteBtn";

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

export default async function AdminQnaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) notFound();

  const post = await getPost(id);
  if (!post) notFound();

  const all = await listAllPosts();
  const byId = new Map(all.map((p) => [p.id, p]));
  const subtreeIds = collectSubtreeIds(id, buildChildrenMap(all));
  const threadPosts = subtreeIds
    .map((i) => byId.get(i))
    .filter((p): p is QnaPost => p != null);
  threadPosts.sort((a, b) => a.createdAt - b.createdAt);
  const descendants = threadPosts.filter((p) => p.id !== id);

  return (
    <div
      style={{
        width: 940,
        margin: "24px auto",
        fontFamily: "굴림, Gulim, sans-serif",
        fontSize: 14,
        color: "#333",
        lineHeight: 1.6,
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
        <Link href="/admin/qna" style={{ fontSize: 13, color: "#007bd1" }}>
          ← 목록
        </Link>
        <form action={logoutAction}>
          <button type="submit" style={{ fontSize: 13, padding: "6px 14px" }}>
            로그아웃
          </button>
        </form>
      </div>

      <h1 style={{ fontSize: 18 }}>
        {post.isSecret ? "🔒 " : ""}글 #{post.id}
      </h1>
      <p style={{ color: "#666", fontSize: 13 }}>
        {post.name}
        {post.email ? ` · ${post.email}` : ""} ·{" "}
        {new Date(post.createdAt).toLocaleString("ko-KR")}
        {post.ip ? ` · IP ${post.ip}` : ""}
      </p>

      <ArticleBlock
        post={post}
        label="선택 글"
        deleteTitle={post.title}
      />

      {descendants.length > 0 && (
        <h2 style={{ fontSize: 16, marginTop: 28 }}>
          스레드 답글 ({descendants.length})
        </h2>
      )}
      {descendants.map((p) => (
        <ArticleBlock
          key={p.id}
          post={p}
          label={`#${p.id} 답글`}
          deleteTitle={p.title}
        />
      ))}
    </div>
  );
}

function ArticleBlock({
  post,
  label,
  deleteTitle,
}: {
  post: QnaPost;
  label: string;
  deleteTitle: string;
}) {
  return (
    <section
      style={{
        marginTop: 16,
        padding: 16,
        border: "1px solid #dedede",
        background: "#fafafa",
        marginLeft: post.depth * 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 6 }}>
            {label}: {post.isSecret ? "🔒 " : ""}
            {post.title}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {post.name} · depth {post.depth}
          </div>
        </div>
        <AdminQnaDeleteBtn id={post.id} title={deleteTitle} />
      </div>
      <div
        style={{
          marginTop: 12,
          whiteSpace: "pre-wrap",
          fontSize: 14,
          background: "#fff",
          padding: 12,
          border: "1px solid #eee",
        }}
      >
        {post.content}
      </div>
    </section>
  );
}
