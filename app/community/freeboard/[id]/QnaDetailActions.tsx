"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";

const btn: CSSProperties = {
  fontSize: 14,
  padding: "6px 16px",
  marginRight: 8,
  background: "#f0f0f0",
  border: "1px solid #ccc",
  cursor: "pointer",
};

export default function QnaDetailActions({ id }: { id: number }) {
  const router = useRouter();

  async function onDelete() {
    const pwd = window.prompt("삭제하려면 비밀번호를 입력하세요.");
    if (pwd === null) return;
    const res = await fetch(`/api/qna/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(data.error ?? "삭제에 실패했습니다.");
      return;
    }
    router.push("/community/freeboard");
    router.refresh();
  }

  return (
    <p style={{ marginTop: 16, textAlign: "right" }}>
      <button
        type="button"
        style={btn}
        onClick={() => router.push(`/community/freeboard/edit/${id}`)}
      >
        수정
      </button>
      <button type="button" style={{ ...btn, marginRight: 0 }} onClick={onDelete}>
        삭제
      </button>
    </p>
  );
}
