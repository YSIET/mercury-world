import { attachmentUrl, getAttachmentsFor } from "@/lib/attachments";

export default function PostAttachmentSection({
  boardId,
  bdNo,
}: {
  boardId: string;
  bdNo: number;
}) {
  const attaches = getAttachmentsFor(boardId, bdNo);
  if (attaches.length === 0) return null;

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
        📎 첨부파일 ({attaches.length})
      </div>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {attaches.map((a) => (
          <li key={a.bf_no} style={{ padding: "4px 0" }}>
            <a
              href={attachmentUrl(boardId, a.save_name)}
              download={a.real_name}
              style={{ color: "#007bd1", textDecoration: "underline" }}
            >
              {a.real_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
