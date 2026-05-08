"use client";

import { useRouter } from "next/navigation";

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
        onClick={() => router.push(`/community/freeboard/edit/${id}`)}
        style={{ marginRight: 8 }}
      >
        수정
      </button>
      <button type="button" onClick={onDelete}>
        삭제
      </button>
    </p>
  );
}
