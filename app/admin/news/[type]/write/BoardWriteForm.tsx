"use client";

import type { BoardType } from "@/lib/board";
import { listPathForBoardType } from "@/lib/board";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import type { BoardAttachment } from "@/lib/board";
import AdminBoardAttachmentsField from "@/components/AdminBoardAttachmentsField";

export default function BoardWriteForm({
  boardType,
}: {
  boardType: BoardType;
}) {
  const router = useRouter();
  const list = listPathForBoardType(boardType);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("수은세상");
  const [attachmentItems, setAttachmentItems] = useState<BoardAttachment[]>(
    []
  );
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/board", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: boardType,
          title,
          content,
          author,
          attachments: attachmentItems.length ? attachmentItems : undefined,
        }),
      });
      const d = (await r.json()) as { error?: string };
      if (!r.ok) {
        setErr(d.error ?? "저장 실패");
        return;
      }
      router.push(`${list}?page=1`);
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
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>수은소식 — 글쓰기</h1>
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
        <a href={list} style={{ color: "#007bd1" }}>
          ← 목록
        </a>
      </p>
    </div>
  );
}
