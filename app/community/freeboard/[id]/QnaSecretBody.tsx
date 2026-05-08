"use client";

import { useState } from "react";

const bodyStyle = {
  fontSize: 14,
  lineHeight: 1.5,
} as const;

export default function QnaSecretBody({ postId }: { postId: number }) {
  const [unlocked, setUnlocked] = useState(false);
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/qna/posts/${postId}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "오류가 발생했습니다.");
      return;
    }
    setContent(data.content);
    setUnlocked(true);
  }

  if (unlocked) {
    return (
      <div style={{ whiteSpace: "pre-wrap", ...bodyStyle }}>{content}</div>
    );
  }

  return (
    <div style={{ ...bodyStyle, padding: 16, background: "#f9f9f9", border: "1px solid #ddd" }}>
      <p style={{ marginBottom: 12 }}>비밀글입니다. 글 작성 시 입력한 비밀번호로 열람할 수 있습니다.</p>
      <form onSubmit={onSubmit} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <label style={{ fontSize: 14 }}>
          비밀번호{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "4px 8px", fontSize: 14 }}
            required
          />
        </label>
        <button type="submit" style={{ fontSize: 14, padding: "6px 16px" }}>
          확인
        </button>
      </form>
      {error && (
        <p style={{ color: "red", marginTop: 12, fontSize: 13 }}>{error}</p>
      )}
    </div>
  );
}
