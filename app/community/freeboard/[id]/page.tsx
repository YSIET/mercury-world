import SubPageLayout from "@/components/SubPageLayout";
import { getPostByLegacyId, formatDate, postBodyUsesHtml } from "@/lib/posts";
import { getPost } from "@/lib/qna";
import { notFound } from "next/navigation";
import QnaDetailActions from "./QnaDetailActions";

function formatQnaDate(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10).replace(/-/g, ".");
}

export default async function Page({ params }: { params: { id: string } }) {
  const slug = "freeboard";
  const idNum = parseInt(params.id, 10);
  if (Number.isNaN(idNum)) notFound();

  const qna = await getPost(idNum);
  if (qna) {
    return (
      <SubPageLayout
        activeGroup={1400}
        sideGroup={1400}
        activePath="/community/freeboard"
        leftCategory="community"
        heroImg="/img/community/img.gif"
        titleImg="/img/community/title_1.gif"
        breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기</>}
      >
        <table
          width="100%"
          border={0}
          cellPadding={5}
          cellSpacing={0}
          style={{ marginTop: 10, borderTop: "2px solid #444" }}
        >
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd", background: "#f9f9f9" }}>
              <td colSpan={2} style={{ padding: 10 }}>
                <strong style={{ fontSize: 14 }}>{qna.title}</strong>
                <span style={{ marginLeft: 8, fontSize: 11, color: "#0066cc" }}>
                  [동적]
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee", fontSize: 11, color: "#777" }}>
              <td style={{ padding: "6px 10px" }}>
                {qna.name}
                {qna.email ? ` · ${qna.email}` : ""}
              </td>
              <td style={{ padding: "6px 10px", textAlign: "right" }}>
                {formatQnaDate(qna.createdAt)}
                {qna.updatedAt !== qna.createdAt
                  ? ` · 수정 ${formatQnaDate(qna.updatedAt)}`
                  : ""}{" "}
                | 조회 0
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ padding: 20, minHeight: 200, lineHeight: 1.6 }}
              >
                <div style={{ whiteSpace: "pre-wrap" }}>{qna.content}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <QnaDetailActions id={idNum} />
        <p style={{ marginTop: 20, textAlign: "right" }}>
          <a href="/community/freeboard" style={{ color: "#444" }}>
            [ 목록 ]
          </a>
        </p>
      </SubPageLayout>
    );
  }

  const post = getPostByLegacyId(slug, idNum);
  if (!post) notFound();

  return (
    <SubPageLayout
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/freeboard"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_1.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기</>}
    >
      <table
        width="100%"
        border={0}
        cellPadding={5}
        cellSpacing={0}
        style={{ marginTop: 10, borderTop: "2px solid #444" }}
      >
        <tbody>
          <tr style={{ borderBottom: "1px solid #ddd", background: "#f9f9f9" }}>
            <td colSpan={2} style={{ padding: 10 }}>
              <strong style={{ fontSize: 14 }}>{post.title}</strong>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee", fontSize: 11, color: "#777" }}>
            <td style={{ padding: "6px 10px" }}>{post.author_name}</td>
            <td style={{ padding: "6px 10px", textAlign: "right" }}>
              {formatDate(post.created_at)} | 조회 {post.hit_count}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: 20, minHeight: 200, lineHeight: 1.6 }}>
              {postBodyUsesHtml(post) ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div style={{ whiteSpace: post.no_br ? "pre-wrap" : "pre-line" }}>
                  {post.content}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: 20, textAlign: "right" }}>
        <a href="/community/freeboard" style={{ color: "#444" }}>
          [ 목록 ]
        </a>
      </p>
    </SubPageLayout>
  );
}
