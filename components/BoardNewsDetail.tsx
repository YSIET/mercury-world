import SubPageLayout from "@/components/SubPageLayout";
import { formatDate, contentUsesHtml } from "@/lib/post-utils";
import { notFound } from "next/navigation";
import {
  BOARD_TITLE_IMG,
  boardSectionHeading,
  getBoardNeighbors,
  listPathForBoardType,
  publicBoardListId,
  resolveBoardPost,
  type BoardType,
} from "@/lib/board";
import { isAdminFromCookies } from "@/lib/admin-auth-server";
import BoardViewTracker from "@/components/BoardViewTracker";
import BoardDetailAdminActions from "@/components/BoardDetailAdminActions";

function KvAttachmentBlock({
  attachments,
}: {
  attachments?: { name: string; url: string; size?: number }[];
}) {
  if (!attachments?.length) return null;
  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        background: "#f9f9f9",
        border: "1px solid #dedede",
        fontSize: 14,
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>
        첨부 ({attachments.length})
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 0,
          listStyle: "none",
          display: "grid",
          gap: 8,
        }}
      >
        {attachments.map((a, i) => (
          <li key={`${a.url}-${i}`}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bd1", textDecoration: "underline" }}
            >
              {a.name}
            </a>
            {a.size != null ? (
              <span style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>
                ({(a.size / 1024).toFixed(1)} KB)
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function BoardNewsDetail({
  boardType,
  id,
}: {
  boardType: BoardType;
  id: string;
}) {
  const resolved = await resolveBoardPost(boardType, id);
  if (!resolved) notFound();

  const isAdmin = await isAdminFromCookies();
  const publicId = publicBoardListId(resolved.post);
  const neighbors = await getBoardNeighbors(boardType, publicId);
  const activePath = listPathForBoardType(boardType);
  const heading = boardSectionHeading(boardType);
  const listBase = listPathForBoardType(boardType);

  const { post } = resolved;
  const title = post.title;
  const authorName = post.author;
  const created = post.createdAt;
  const hits = resolved.displayHits;

  return (
    <SubPageLayout
      activeGroup={1300}
      sideGroup={1300}
      activePath={activePath}
      leftCategory="news"
      heroImg="/img/news/img.gif"
      titleImg={BOARD_TITLE_IMG[boardType]}
      breadcrumb={<>HOME &gt; 수은소식 &gt; {heading}</>}
    >
      <BoardViewTracker boardType={boardType} kvPostId={post.id} />
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
              <h1 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{title}</h1>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee", fontSize: 11, color: "#777" }}>
            <td style={{ padding: "6px 10px" }}>
              {authorName}
              {isAdmin ? (
                <BoardDetailAdminActions
                  boardType={boardType}
                  kvId={post.id}
                />
              ) : null}
            </td>
            <td style={{ padding: "6px 10px", textAlign: "right" }}>
              {formatDate(created)} | 조회 {hits}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: 20, minHeight: 200, lineHeight: 1.6 }}>
              {contentUsesHtml(post.content) ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <KvAttachmentBlock attachments={post.attachments} />
      <p style={{ marginTop: 16, fontSize: 13, color: "#555" }}>
        {neighbors.next ? (
          <>
            <a href={neighbors.next.href} style={{ color: "#444" }}>
              다음글
            </a>
            {" · "}
          </>
        ) : null}
        {neighbors.prev ? (
          <a href={neighbors.prev.href} style={{ color: "#444" }}>
            이전글
          </a>
        ) : null}
      </p>
      <p style={{ marginTop: 20, textAlign: "right" }}>
        <a href={listBase} style={{ color: "#444" }}>
          [ 목록 ]
        </a>
      </p>
    </SubPageLayout>
  );
}
