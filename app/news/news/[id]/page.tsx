import SubPageLayout from "@/components/SubPageLayout";
import { getPostByLegacyId, formatDate } from "@/lib/posts";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const slug = "news";
  const post = getPostByLegacyId(slug, parseInt(params.id, 10));
  if (!post) notFound();

  return (
    <SubPageLayout
      activeGroup={1300}
      sideGroup={1300}
      activePath="/news/news"
      leftCategory="news"
      heroImg="/img/news/img.gif"
      titleImg="/img/news/title_2.gif"
      breadcrumb={<>HOME &gt; 수은소식 &gt; 수은관련뉴스</>}
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
              {post.is_html ? (
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
        <a href="/news/news" style={{ color: "#444" }}>
          [ 목록 ]
        </a>
      </p>
    </SubPageLayout>
  );
}
