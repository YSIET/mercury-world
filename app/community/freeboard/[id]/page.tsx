import SubPageLayout from "@/components/SubPageLayout";
import { getPostByUrlId } from "@/lib/qna";
import { notFound } from "next/navigation";
import QnaDetailActions from "./QnaDetailActions";
import QnaSecretBody from "./QnaSecretBody";
import { contentUsesHtml, plainTextExcerpt } from "@/lib/post-utils";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const idNum = parseInt(params.id, 10);
  if (Number.isNaN(idNum)) return { title: "묻고답하기" };
  const qna = await getPostByUrlId(idNum);
  if (!qna) return { title: "묻고답하기" };
  const desc = qna.isSecret
    ? "비밀글입니다."
    : plainTextExcerpt(qna.content, 160);
  return {
    title: qna.title,
    description: desc,
    robots: qna.isSecret ? { index: false, follow: true } : undefined,
    openGraph: {
      title: qna.title,
      description: desc,
    },
    twitter: {
      title: qna.title,
      description: desc,
    },
  };
}

function formatQnaDate(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10).replace(/-/g, ".");
}

const metaStyle = {
  fontSize: 13,
  color: "#666",
  lineHeight: 1.5,
} as const;

const bodyStyle = {
  fontSize: 14,
  lineHeight: 1.5,
} as const;

export default async function Page({ params }: { params: { id: string } }) {
  const idNum = parseInt(params.id, 10);
  if (Number.isNaN(idNum)) notFound();

  const qna = await getPostByUrlId(idNum);
  if (!qna) notFound();

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
              <strong style={{ fontSize: 14, lineHeight: 1.5 }}>{qna.title}</strong>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee", ...metaStyle }}>
            <td style={{ padding: "6px 10px", ...metaStyle }}>
              {qna.name}
              {qna.email ? ` · ${qna.email}` : ""}
            </td>
            <td style={{ padding: "6px 10px", textAlign: "right", ...metaStyle }}>
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
              style={{ padding: 20, minHeight: 200, ...bodyStyle }}
            >
              {qna.isSecret ? (
                <QnaSecretBody postId={idNum} />
              ) : contentUsesHtml(qna.content) ? (
                <div
                  style={bodyStyle}
                  dangerouslySetInnerHTML={{ __html: qna.content }}
                />
              ) : (
                <div style={{ whiteSpace: "pre-wrap", ...bodyStyle }}>
                  {qna.content}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <QnaDetailActions id={idNum} depth={qna.depth} />
      <p style={{ marginTop: 20, textAlign: "right", fontSize: 14 }}>
        <a href="/community/freeboard" style={{ color: "#444" }}>
          [ 목록 ]
        </a>
      </p>
    </SubPageLayout>
  );
}
