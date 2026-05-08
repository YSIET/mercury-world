"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

const PAGE_SIZE = 10;

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
  }));
}

export default function FreeboardListMerged({
  initialPosts,
  listBase,
}: {
  initialPosts: Post[];
  listBase: string;
}) {
  const router = useRouter();
  const [dynamicRows, setDynamicRows] = useState<QnaRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/qna/posts?page=1&size=1000", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const posts = d.posts ?? [];
        setDynamicRows(
          posts.map(
            (p: {
              id: number;
              title: string;
              name: string;
              createdAt: number;
            }) => ({
              id: p.id,
              title: p.title,
              author: p.name,
              dateStr: new Date(p.createdAt)
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "."),
              hit: 0,
              href: `${listBase}/${p.id}`,
              isDynamic: true,
              sortTime: p.createdAt,
            })
          )
        );
      })
      .catch(() => {});
  }, [listBase]);

  const merged = useMemo(() => {
    return [...staticRows(initialPosts, listBase), ...dynamicRows].sort(
      (a, b) => b.sortTime - a.sortTime
    );
  }, [initialPosts, listBase, dynamicRows]);

  const totalPages = Math.max(1, Math.ceil(merged.length / PAGE_SIZE));

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
                  <td style={{ ...tdStyle, paddingLeft: 8 }}>
                    <a
                      href={row.href}
                      style={{
                        color: row.isDynamic ? "#0066cc" : "#444",
                        fontSize: 14,
                      }}
                    >
                      {row.title}
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
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
            fontSize: 14,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          <button
            type="button"
            style={writeBtnStyle}
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, j) => j + 1).map((p) => (
            <button
              key={p}
              type="button"
              style={{
                ...writeBtnStyle,
                minWidth: 32,
                fontWeight: p === currentPage ? "bold" : "normal",
                background: p === currentPage ? "#e0e0e0" : "#f0f0f0",
              }}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            style={writeBtnStyle}
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            &gt;
          </button>
        </nav>
      )}
    </>
  );
}
