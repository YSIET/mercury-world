"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

const writeBtnStyle: CSSProperties = {
  fontSize: 14,
  padding: "6px 16px",
  background: "#f0f0f0",
  border: "1px solid #ccc",
  cursor: "pointer",
};

type QnaRow = {
  id: number;
  title: string;
  author: string;
  dateStr: string;
  hit: number;
  href: string;
  isDynamic: boolean;
  sortTime: number;
  isNotice?: boolean;
  depth?: number;
  isSecret?: boolean;
};

type ApiPost = {
  id: number;
  title: string;
  name: string;
  createdAt: number;
  parentId?: number;
  rootId?: number;
  depth?: number;
  isSecret?: boolean;
  legacyBdNo?: number;
};

function staticRows(posts: Post[], listBase: string): QnaRow[] {
  const sorted = [...posts].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });
  return sorted.map((post) => ({
    id: post.legacy_bd_no,
    title: post.title,
    author: post.author_name,
    dateStr: formatDate(post.created_at),
    hit: post.hit_count,
    href: `${listBase}/${post.legacy_bd_no}`,
    isDynamic: false,
    sortTime: post.created_at ? new Date(post.created_at).getTime() : 0,
    isNotice: post.is_notice,
    depth: 0,
    isSecret: false,
  }));
}

function mergeStaticAndDynamic(
  initialPosts: Post[],
  listBase: string,
  apiPosts: ApiPost[]
): QnaRow[] {
  const staticSorted = staticRows(initialPosts, listBase);
  const normalized = apiPosts.map((p) => ({
    ...p,
    depth: p.depth ?? 0,
    isSecret: p.isSecret ?? false,
  }));
  const children = new Map<number, typeof normalized>();
  for (const p of normalized) {
    if (p.parentId == null) continue;
    if (!children.has(p.parentId)) children.set(p.parentId, []);
    children.get(p.parentId)!.push(p);
  }
  for (const [, arr] of children) {
    arr.sort((a, b) => a.createdAt - b.createdAt);
  }
  const roots = normalized
    .filter((p) => p.parentId == null)
    .sort((a, b) => b.createdAt - a.createdAt);

  const merged: QnaRow[] = [];
  type N = (typeof normalized)[number];
  const toRow = (p: N): QnaRow => {
    const pubId = p.legacyBdNo ?? p.id;
    return {
      id: pubId,
      title: p.title,
      author: p.name,
      dateStr: new Date(p.createdAt)
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "."),
      hit: 0,
      href: `${listBase}/${pubId}`,
      isDynamic: true,
      sortTime: p.createdAt,
      depth: p.depth,
      isSecret: p.isSecret,
    };
  };

  function dfs(p: N) {
    merged.push(toRow(p));
    for (const c of children.get(p.id) ?? []) dfs(c);
  }

  let si = 0;
  let ri = 0;
  while (si < staticSorted.length || ri < roots.length) {
    const s = staticSorted[si];
    const r = roots[ri];
    if (!s) {
      dfs(r);
      ri++;
      continue;
    }
    if (!r) {
      merged.push(s);
      si++;
      continue;
    }
    if (s.sortTime >= r.createdAt) {
      merged.push(s);
      si++;
    } else {
      dfs(r);
      ri++;
    }
  }
  return merged;
}

export default function FreeboardListMerged({
  initialPosts,
  listBase,
}: {
  initialPosts: Post[];
  listBase: string;
}) {
  const router = useRouter();
  const [apiPosts, setApiPosts] = useState<ApiPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoverPage, setHoverPage] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/qna/posts?page=1&size=1000", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setApiPosts(d.posts ?? []);
      })
      .catch(() => {});
  }, [listBase]);

  const merged = useMemo(
    () => mergeStaticAndDynamic(initialPosts, listBase, apiPosts),
    [initialPosts, listBase, apiPosts]
  );

  const unifiedTotal = merged.length;
  const totalPages = Math.max(1, Math.ceil(unifiedTotal / PAGE_SIZE));
  const groupStart =
    Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(
    groupStart + PAGE_GROUP_SIZE - 1,
    totalPages
  );
  const hasPrevGroup = groupStart > 1;
  const hasNextGroup = groupEnd < totalPages;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageRows = merged.slice(startIdx, startIdx + PAGE_SIZE);

  function WriteButton() {
    return (
      <button
        type="button"
        style={writeBtnStyle}
        onClick={() => router.push("/community/freeboard/write")}
      >
        글쓰기
      </button>
    );
  }

  const thStyle: CSSProperties = {
    fontSize: 14,
    lineHeight: 1.5,
    background: "#f5f5f5",
  };
  const tdStyle: CSSProperties = {
    fontSize: 14,
    lineHeight: 1.5,
  };
  const metaStyle: CSSProperties = {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.5,
  };

  return (
    <>
      <p style={{ margin: "10px 0", textAlign: "right" }}>
        <WriteButton />
      </p>
      <table
        width="100%"
        border={0}
        cellPadding={0}
        cellSpacing={1}
        style={{ background: "#cccccc", marginTop: 4 }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th height={36} width={60} style={thStyle}>
              번호
            </th>
            <th style={thStyle}>제목</th>
            <th width={100} style={thStyle}>
              작성자
            </th>
            <th width={90} style={thStyle}>
              작성일
            </th>
            <th width={60} style={thStyle}>
              조회
            </th>
          </tr>
        </thead>
        <tbody>
          {merged.length === 0 ? (
            <tr style={{ background: "white" }}>
              <td colSpan={5} align="center" height={60} style={tdStyle}>
                등록된 글이 없습니다.
              </td>
            </tr>
          ) : (
            pageRows.map((row, i) => {
              const globalIdx = startIdx + i;
              return (
                <tr
                  key={`${row.isDynamic ? "d" : "s"}-${row.id}-${globalIdx}`}
                  style={{ background: "white" }}
                >
                  <td align="center" height={32} style={tdStyle}>
                    {row.isNotice ? (
                      <span style={metaStyle}>공지</span>
                    ) : row.isDynamic ? (
                      <span style={{ color: "#0066cc", fontWeight: "bold" }}>
                        N{row.id}
                      </span>
                    ) : (
                      merged.length - globalIdx
                    )}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      paddingLeft: 8 + (row.depth ?? 0) * 20,
                    }}
                  >
                    <a
                      href={row.href}
                      style={{
                        color: row.isDynamic ? "#0066cc" : "#444",
                        fontSize: 14,
                      }}
                    >
                      {(row.isSecret ? "🔒 " : "") +
                        ((row.depth ?? 0) >= 1 ? "└ " : "") +
                        row.title}
                    </a>
                  </td>
                  <td align="center" style={metaStyle}>
                    {row.author}
                  </td>
                  <td align="center" style={metaStyle}>
                    {row.dateStr}
                  </td>
                  <td align="center" style={metaStyle}>
                    {row.hit}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <p style={{ margin: "14px 0 10px", textAlign: "right" }}>
        <WriteButton />
      </p>
      {merged.length > 0 && (
        <div
          style={{
            textAlign: "center",
            margin: "20px 0 16px",
            fontSize: 14,
            lineHeight: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span
            role="button"
            tabIndex={hasPrevGroup ? 0 : -1}
            onKeyDown={(e) => {
              if (!hasPrevGroup) return;
              if (e.key === "Enter" || e.key === " ")
                setCurrentPage(groupStart - 1);
            }}
            onClick={() => hasPrevGroup && setCurrentPage(groupStart - 1)}
            style={{
              padding: "4px 10px",
              cursor: hasPrevGroup ? "pointer" : "default",
              color: hasPrevGroup ? "#333" : "#ccc",
              userSelect: "none",
            }}
          >
            ‹
          </span>
          {Array.from(
            { length: groupEnd - groupStart + 1 },
            (_, i) => groupStart + i
          ).map((p) => (
            <span
              key={p}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCurrentPage(p);
              }}
              onClick={() => setCurrentPage(p)}
              onMouseEnter={() => setHoverPage(p)}
              onMouseLeave={() => setHoverPage(null)}
              style={{
                padding: "4px 10px",
                cursor: "pointer",
                fontWeight: p === currentPage ? "bold" : "normal",
                color: p === currentPage ? "#007bd1" : "#333",
                background: p === currentPage ? "#f0f8ff" : "transparent",
                textDecoration:
                  hoverPage === p && p !== currentPage ? "underline" : "none",
                userSelect: "none",
              }}
            >
              {p}
            </span>
          ))}
          <span
            role="button"
            tabIndex={hasNextGroup ? 0 : -1}
            onKeyDown={(e) => {
              if (!hasNextGroup) return;
              if (e.key === "Enter" || e.key === " ")
                setCurrentPage(groupEnd + 1);
            }}
            onClick={() => hasNextGroup && setCurrentPage(groupEnd + 1)}
            style={{
              padding: "4px 10px",
              cursor: hasNextGroup ? "pointer" : "default",
              color: hasNextGroup ? "#333" : "#ccc",
              userSelect: "none",
            }}
          >
            ›
          </span>
        </div>
      )}
    </>
  );
}
