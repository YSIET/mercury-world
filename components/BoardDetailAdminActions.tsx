"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BoardType } from "@/lib/board";
import { listPathForBoardType } from "@/lib/board";

export default function BoardDetailAdminActions({
  boardType,
  kvId,
}: {
  boardType: BoardType;
  kvId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const list = listPathForBoardType(boardType);

  async function onDelete() {
    if (!confirm("이 글을 삭제할까요?")) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/board", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: boardType, id: kvId }),
        credentials: "include",
      });
      if (r.ok) {
        router.push(list);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <span style={{ marginLeft: 12 }}>
      <a
        href={`/admin/news/${boardType}/${kvId}/edit`}
        style={{ color: "#007bd1", marginRight: 10 }}
      >
        수정
      </a>
      <button
        type="button"
        disabled={busy}
        onClick={onDelete}
        style={{
          background: "#f5f5f5",
          border: "1px solid #ccc",
          cursor: busy ? "default" : "pointer",
          fontSize: 13,
        }}
      >
        삭제
      </button>
    </span>
  );
}
