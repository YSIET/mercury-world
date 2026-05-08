"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

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
  const [dynamicRows, setDynamicRows] = useState<QnaRow[]>([]);

  useEffect(() => {
    fetch("/api/qna/posts?page=1&size=100", { credentials: "include" })
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

  return (
    <>
      <table
        width="100%"
        border={0}
        cellPadding={0}
        cellSpacing={1}
        style={{ background: "#cccccc", marginTop: 10 }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th height={30} width={60}>
              번호
            </th>
            <th>제목</th>
            <th width={100}>작성자</th>
            <th width={80}>작성일</th>
            <th width={60}>조회</th>
          </tr>
        </thead>
        <tbody>
          {merged.length === 0 ? (
            <tr style={{ background: "white" }}>
              <td colSpan={5} align="center" height={60}>
                등록된 글이 없습니다.
              </td>
            </tr>
          ) : (
            merged.map((row, i) => (
              <tr key={`${row.isDynamic ? "d" : "s"}-${row.id}`} style={{ background: "white" }}>
                <td align="center" height={28}>
                  {row.isNotice ? (
                    "공지"
                  ) : row.isDynamic ? (
                    <span style={{ color: "#0066cc", fontWeight: "bold" }}>
                      N{row.id}
                    </span>
                  ) : (
                    merged.length - i
                  )}
                </td>
                <td style={{ paddingLeft: 8 }}>
                  <a
                    href={row.href}
                    style={{ color: row.isDynamic ? "#0066cc" : "#444" }}
                  >
                    {row.title}
                  </a>
                </td>
                <td align="center">{row.author}</td>
                <td align="center">{row.dateStr}</td>
                <td align="center">{row.hit}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <p style={{ marginTop: 16, textAlign: "right" }}>
        <a
          href="/community/freeboard/write"
          style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "#5fb3b3",
            color: "white",
            textDecoration: "none",
            fontSize: 12,
          }}
        >
          글쓰기
        </a>
      </p>
    </>
  );
}
