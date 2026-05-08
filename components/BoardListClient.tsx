"use client";

import type { CSSProperties } from "react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BoardType, BoardListRow } from "@/lib/board";
import { listPathForBoardType } from "@/lib/board";

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

const writeBtnStyle: CSSProperties = {
  fontSize: 14,
  padding: "6px 16px",
  background: "#f0f0f0",
  border: "1px solid #ccc",
  cursor: "pointer",
};

type ApiPage = {
  rows: BoardListRow[];
  total: number;
  page: number;
  totalPages: number;
};

function BoardListInner({
  boardType,
  isAdmin,
}: {
  boardType: BoardType;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listBase = listPathForBoardType(boardType);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [data, setData] = useState<ApiPage | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/board/${boardType}?page=${page}&size=${PAGE_SIZE}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d: ApiPage) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [boardType, page]);

  const [hoverPage, setHoverPage] = useState<number | null>(null);

  function goPage(p: number) {
    if (p <= 1) router.push(listBase);
    else router.push(`${listBase}?page=${p}`);
  }

  function WriteButton() {
    if (!isAdmin) return null;
    return (
      <button
        type="button"
        style={writeBtnStyle}
        onClick={() => router.push(`/admin/news/${boardType}/write`)}
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

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? page;

  const groupStart =
    Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(
    groupStart + PAGE_GROUP_SIZE - 1,
    totalPages
  );
  const hasPrevGroup = groupStart > 1;
  const hasNextGroup = groupEnd < totalPages;

  const startIdx = (currentPage - 1) * PAGE_SIZE;

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
          {!data ? (
            <tr style={{ background: "white" }}>
              <td colSpan={5} align="center" height={60} style={tdStyle}>
                불러오는 중…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr style={{ background: "white" }}>
              <td colSpan={5} align="center" height={60} style={tdStyle}>
                등록된 글이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const globalIdx = startIdx + i;
              const numLabel = row.isNotice ? (
                <span style={metaStyle}>공지</span>
              ) : (
                total - globalIdx
              );
              return (
                <tr
                  key={row.key}
                  style={{ background: "white" }}
                >
                  <td align="center" height={32} style={tdStyle}>
                    {numLabel}
                  </td>
                  <td style={{ ...tdStyle, paddingLeft: 8 }}>
                    <a
                      href={`${listBase}/${row.listId}`}
                      style={{
                        color: "#444",
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
                    {row.displayHits}
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
      {data && total > 0 && (
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
              if (e.key === "Enter" || e.key === " ") goPage(groupStart - 1);
            }}
            onClick={() => hasPrevGroup && goPage(groupStart - 1)}
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
            (_, idx) => groupStart + idx
          ).map((p) => (
            <span
              key={p}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goPage(p);
              }}
              onClick={() => goPage(p)}
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
              if (e.key === "Enter" || e.key === " ") goPage(groupEnd + 1);
            }}
            onClick={() => hasNextGroup && goPage(groupEnd + 1)}
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

export default function BoardListClient({
  boardType,
  isAdmin,
}: {
  boardType: BoardType;
  isAdmin: boolean;
}) {
  return (
    <Suspense
      fallback={
        <p style={{ margin: 16, fontSize: 14 }}>페이지를 불러오는 중…</p>
      }
    >
      <BoardListInner boardType={boardType} isAdmin={isAdmin} />
    </Suspense>
  );
}
