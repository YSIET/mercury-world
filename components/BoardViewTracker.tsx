"use client";

import { useEffect } from "react";
import type { BoardType } from "@/lib/board";

export default function BoardViewTracker({
  boardType,
  kvPostId,
}: {
  boardType: BoardType;
  /** KV 저장 키 (`legacy:123` 또는 UUID) */
  kvPostId: string;
}) {
  useEffect(() => {
    fetch(`/api/board/${boardType}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kvPostId }),
      credentials: "include",
    }).catch(() => {});
  }, [boardType, kvPostId]);
  return null;
}
