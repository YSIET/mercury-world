"use client";

import type { BoardPost, BoardType, BoardAttachment } from "@/lib/board";
import { listPathForBoardType, publicBoardListId } from "@/lib/board";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import AdminBoardAttachmentsField from "@/components/AdminBoardAttachmentsField";

export default function BoardEditForm({ post }: { post: BoardPost }) {
  const router = useRouter();
  const list = listPathForBoardType(post.type);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [author, setAuthor] = useState(post.author);
  const [attachmentItems, setAttachmentItems] = useState<BoardAttachment[]>(
    post.attachments ?? []
  );
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/board", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: post.type as BoardType,
          id: post.id,
          title,
          content,
          author,
          attachments: attachmentItems,
        }),
      });
      const d = (await r.json()) as { error?: string };
      if (!r.ok) {
        setErr(d.error ?? "저장 실패");
        return;
      }
      router.push(`${list}/${publicBoardListId(post)}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = {
    width: "100%",
    maxWidth: 640,
    boxSizing: "border-box" as const,
    padding: "8px",
    fontSize: 14,
  };

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>수은소식 — 수정</h1>
      <form onSubmit={submit}>
        <p>
          <label>
            제목
            <br />
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </label>
        </p>
        <p>
          <label>
            작성자
            <br />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={inputStyle}
            />
          </label>
        </p>
        <p>
          <label>
            본문
            <br />
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              style={{ ...inputStyle, minHeight: 220 }}
            />
          </label>
        </p>
        <p>
          <AdminBoardAttachmentsField
            items={attachmentItems}
            onChange={setAttachmentItems}
          />
        </p>
        {err ? (
          <p style={{ color: "#c00", fontSize: 14 }}>{err}</p>
        ) : null}
        <p>
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              cursor: busy ? "default" : "pointer",
            }}
          >
            저장
          </button>
        </p>
      </form>
      <p style={{ marginTop: 16 }}>
        <a href={`${list}/${publicBoardListId(post)}`} style={{ color: "#007bd1" }}>
          ← 글 보기
        </a>
      </p>
    </div>
  );
}
