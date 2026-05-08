"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { QnaPost } from "@/lib/qna";

function buildChildrenMap(posts: QnaPost[]): Map<number, number[]> {
  const m = new Map<number, number[]>();
  for (const p of posts) {
    if (p.parentId == null) continue;
    if (!m.has(p.parentId)) m.set(p.parentId, []);
    m.get(p.parentId)!.push(p.id);
  }
  for (const [, arr] of m) arr.sort((a, b) => a - b);
  return m;
}

function flattenTree(posts: QnaPost[]): QnaPost[] {
  const byId = new Map(posts.map((p) => [p.id, p]));
  const children = buildChildrenMap(posts);
  const roots = posts
    .filter((p) => p.parentId == null)
    .sort((a, b) => b.createdAt - a.createdAt);
  const out: QnaPost[] = [];
  const walk = (p: QnaPost) => {
    out.push(p);
    for (const cid of children.get(p.id) ?? []) {
      const c = byId.get(cid);
      if (c) walk(c);
    }
  };
  for (const r of roots) walk(r);
  const seen = new Set(out.map((x) => x.id));
  for (const p of posts) {
    if (!seen.has(p.id)) out.push(p);
  }
  return out;
}

function replyCount(id: number, children: Map<number, number[]>): number {
  return (children.get(id) ?? []).length;
}

function formatDate(ts: number) {
  return new Date(ts).toISOString().slice(0, 10).replace(/-/g, ".");
}

export default function AdminQnaClient({ initialPosts }: { initialPosts: QnaPost[] }) {
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const childrenMap = useMemo(() => buildChildrenMap(initialPosts), [initialPosts]);
  const flat = useMemo(() => flattenTree(initialPosts), [initialPosts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flat;
    return flat.filter((p) => {
      const hay = `${p.title} ${p.name} ${p.content}`.toLowerCase();
      return hay.includes(q);
    });
  }, [flat, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  async function onDelete(id: number, title: string) {
    if (!window.confirm(`삭제할까요?\n#${id} ${title}`)) return;
    const res = await fetch(`/api/admin/qna/${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("삭제에 실패했습니다.");
      return;
    }
    window.location.reload();
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <input
          type="search"
          placeholder="제목·작성자·내용 검색"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          style={{ padding: "6px 10px", fontSize: 14, width: 280 }}
        />
        <label style={{ fontSize: 13 }}>
          페이지당{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          건
        </label>
        <span style={{ fontSize: 13, color: "#666" }}>
          {filtered.length}건 표시 (전체 {initialPosts.length}건)
        </span>
      </div>

      <table
        width="100%"
        border={0}
        cellPadding={6}
        cellSpacing={0}
        style={{
          borderCollapse: "collapse",
          fontSize: 13,
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th align="left">번호</th>
            <th align="left">제목</th>
            <th align="left">작성자</th>
            <th align="left">작성일</th>
            <th align="center">비밀</th>
            <th align="center">직계답글</th>
            <th align="center">작업</th>
          </tr>
        </thead>
        <tbody>
          {slice.length === 0 ? (
            <tr>
              <td colSpan={7} align="center" style={{ padding: 24 }}>
                글이 없습니다.
              </td>
            </tr>
          ) : (
            slice.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{p.id}</td>
                <td>
                  <Link
                    href={`/admin/qna/${p.id}`}
                    style={{
                      paddingLeft: p.depth * 16,
                      display: "inline-block",
                      color: "#007bd1",
                    }}
                  >
                    {p.depth > 0 ? "└ " : ""}
                    {p.isSecret ? "🔒 " : ""}
                    {p.title}
                  </Link>
                </td>
                <td>{p.name}</td>
                <td>{formatDate(p.createdAt)}</td>
                <td align="center">{p.isSecret ? "Y" : ""}</td>
                <td align="center">{replyCount(p.id, childrenMap)}</td>
                <td align="center">
                  <button
                    type="button"
                    onClick={() => onDelete(p.id, p.title)}
                    style={{ fontSize: 12, cursor: "pointer" }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((x) => Math.max(1, x - 1))}
          >
            이전
          </button>
          <span style={{ fontSize: 13 }}>
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((x) => Math.min(totalPages, x + 1))}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
