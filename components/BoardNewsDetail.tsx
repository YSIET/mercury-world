import SubPageLayout from "@/components/SubPageLayout";
import PostAttachmentSection from "@/components/PostAttachmentSection";
import { formatDate, postBodyUsesHtml } from "@/lib/posts";
import { notFound } from "next/navigation";
import {
  attachmentBoardIdForType,
  BOARD_TITLE_IMG,
  boardSectionHeading,
  getBoardNeighbors,
  listPathForBoardType,
  resolveBoardPost,
  type BoardType,
} from "@/lib/board";
import { isAdminFromCookies } from "@/lib/admin-auth-server";
import BoardViewTracker from "@/components/BoardViewTracker";
import BoardDetailAdminActions from "@/components/BoardDetailAdminActions";

function kvBodyUsesHtml(content: string): boolean {
  if (!content) return false;
  return /<\s*[a-zA-Z!?/]/.test(content);
}

function KvAttachmentBlock({
  attachments,
}: {
  attachments?: { name: string; url: string }[];
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
        📎 첨부 ({attachments.length})
      </div>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {attachments.map((a, i) => (
          <li key={`${a.url}-${i}`} style={{ padding: "4px 0" }}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bd1", textDecoration: "underline" }}
            >
              {a.name}
            </a>
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
  const neighbors = await getBoardNeighbors(boardType, id, resolved.source);
  const activePath = listPathForBoardType(boardType);
  const heading = boardSectionHeading(boardType);
  const listBase = listPathForBoardType(boardType);
  const listId =
    resolved.source === "json"
      ? String(resolved.post.legacy_bd_no)
      : resolved.post.id;

  const title =
    resolved.source === "json" ? resolved.post.title : resolved.post.title;
  const authorName =
    resolved.source === "json"
      ? resolved.post.author_name
      : resolved.post.author;
  const created =
    resolved.source === "json"
      ? resolved.post.created_at
      : resolved.post.createdAt;
  const hits = resolved.displayHits;

  const attBoardId = attachmentBoardIdForType(boardType);

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
      <BoardViewTracker
        boardType={boardType}
        listId={listId}
        source={resolved.source}
      />
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
              {isAdmin && resolved.source === "kv" ? (
                <BoardDetailAdminActions
                  boardType={boardType}
                  kvId={resolved.post.id}
                />
              ) : null}
            </td>
            <td style={{ padding: "6px 10px", textAlign: "right" }}>
              {formatDate(created)} | 조회 {hits}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: 20, minHeight: 200, lineHeight: 1.6 }}>
              {resolved.source === "json" ? (
                postBodyUsesHtml(resolved.post) ? (
                  <div dangerouslySetInnerHTML={{ __html: resolved.post.content }} />
                ) : (
                  <div
                    style={{
                      whiteSpace: resolved.post.no_br ? "pre-wrap" : "pre-line",
                    }}
                  >
                    {resolved.post.content}
                  </div>
                )
              ) : kvBodyUsesHtml(resolved.post.content) ? (
                <div dangerouslySetInnerHTML={{ __html: resolved.post.content }} />
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>{resolved.post.content}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      {resolved.source === "json" && attBoardId ? (
        <PostAttachmentSection
          boardId={attBoardId}
          bdNo={resolved.post.legacy_bd_no}
        />
      ) : null}
      {resolved.source === "kv" ? (
        <KvAttachmentBlock attachments={resolved.post.attachments} />
      ) : null}
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
