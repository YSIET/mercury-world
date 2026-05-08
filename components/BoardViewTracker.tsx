"use client";

import { useEffect } from "react";
import type { BoardType } from "@/lib/board";

export default function BoardViewTracker({
  boardType,
  listId,
  source,
}: {
  boardType: BoardType;
  listId: string;
  source: "json" | "kv";
}) {
  useEffect(() => {
    fetch(`/api/board/${boardType}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listId, source }),
      credentials: "include",
    }).catch(() => {});
  }, [boardType, listId, source]);
  return null;
}
