"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { QnaPost } from "@/lib/qna";
import AdminQnaDeleteBtn from "./AdminQnaDeleteBtn";

export default function AdminQnaThreadArticle({
  post,
  rootPageId,
  isRoot,
  label,
  deleteTitle,
}: {
  post: QnaPost;
  rootPageId: number;
  isRoot: boolean;
  label: string;
  deleteTitle: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function saveRoot() {
    setErr("");
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/qna/${rootPageId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      const d = (await r.json()) as { error?: string };
      if (!r.ok) {
        setErr(d.error ?? "저장 실패");
        return;
      }
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function saveReply() {
    setErr("");
    setBusy(true);
    try {
      const r = await fetch(
        `/api/admin/qna/${rootPageId}/reply/${post.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content.trim() }),
        }
      );
      const d = (await r.json()) as { error?: string };
      if (!r.ok) {
        setErr(d.error ?? "저장 실패");
        return;
      }
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    setTitle(post.title);
    setContent(post.content);
    setErr("");
    setEditing(false);
  }

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
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", marginBottom: 6 }}>
            {label}: {post.isSecret ? "🔒 " : ""}
            {editing && isRoot ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: 520,
                  fontSize: 14,
                  padding: "6px 8px",
                  marginTop: 6,
                }}
              />
            ) : (
              <span>{post.title}</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {post.name} · depth {post.depth} · 수정{" "}
            {new Date(post.updatedAt).toLocaleString("ko-KR")}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          {!editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setTitle(post.title);
                  setContent(post.content);
                  setEditing(true);
                }}
                style={{ fontSize: 12, padding: "4px 10px", cursor: "pointer" }}
              >
                수정
              </button>
              <AdminQnaDeleteBtn id={post.id} title={deleteTitle} />
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => (isRoot ? saveRoot() : saveReply())}
                style={{ fontSize: 12, padding: "4px 10px", cursor: "pointer" }}
              >
                저장
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={cancel}
                style={{ fontSize: 12, padding: "4px 10px", cursor: "pointer" }}
              >
                취소
              </button>
            </>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          style={{
            marginTop: 12,
            width: "100%",
            boxSizing: "border-box",
            fontSize: 14,
            padding: 12,
            fontFamily: "inherit",
          }}
        />
      ) : (
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
      )}
      {err ? (
        <p style={{ color: "#c00", fontSize: 13, marginTop: 8 }}>{err}</p>
      ) : null}
    </section>
  );
}
