"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { MercuryContentRow } from "@/lib/mercury-content";

type SortKey = "category" | "foodName" | "avgMgKg" | "analyzedAt";

export default function MercuryContentTable({
  initialRows,
  showEditLink,
}: {
  initialRows: MercuryContentRow[];
  showEditLink: boolean;
}) {
  const categories = useMemo(() => {
    const s = new Set(initialRows.map((r) => r.category).filter(Boolean));
    return ["", ...Array.from(s).sort()];
  }, [initialRows]);

  const [filterCat, setFilterCat] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("analyzedAt");
  const [sortAsc, setSortAsc] = useState(false);

  const display = useMemo(() => {
    let rows = [...initialRows];
    if (filterCat) rows = rows.filter((r) => r.category === filterCat);
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "avgMgKg") {
        cmp = a.avgMgKg - b.avgMgKg;
      } else if (sortKey === "analyzedAt") {
        cmp = a.analyzedAt.localeCompare(b.analyzedAt);
      } else {
        cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), "ko");
      }
      return sortAsc ? cmp : -cmp;
    });
    return rows;
  }, [initialRows, filterCat, sortKey, sortAsc]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortAsc(!sortAsc);
    else {
      setSortKey(k);
      setSortAsc(k === "foodName" || k === "category");
    }
  }

  const th: CSSProperties = {
    padding: "8px 6px",
    background: "#f0f0f0",
    borderBottom: "2px solid #ccc",
    fontSize: 13,
    cursor: "pointer",
    userSelect: "none",
    textAlign: "left" as const,
  };

  return (
    <div style={{ maxWidth: 940, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div
          style={{
            padding: 12,
            background: "#f8f8f8",
            border: "1px solid #dedede",
            fontSize: 12,
            color: "#444",
            lineHeight: 1.65,
            maxWidth: 720,
          }}
        >
          본 데이터는 (주)와이에스환경기술연구원이 직접 분석한 결과입니다.
          <br />
          분석은 KOLAS 인정(제364호) 시험분석 절차에 따라 수행되었습니다.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 13, color: "#555" }}>
            분류 필터{" "}
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              style={{ fontSize: 13, marginLeft: 6 }}
            >
              {categories.map((c) => (
                <option key={c || "all"} value={c}>
                  {c || "전체"}
                </option>
              ))}
            </select>
          </label>
          {showEditLink ? (
            <Link
              href="/admin/mercury-content"
              style={{
                fontSize: 13,
                padding: "6px 12px",
                border: "1px solid #308bbc",
                color: "#308bbc",
                textDecoration: "none",
              }}
            >
              편집
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mw-table-scroll">
        <table
          width="100%"
          cellPadding={6}
          cellSpacing={0}
          style={{
            borderCollapse: "collapse",
            fontSize: 13,
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              <th style={th} onClick={() => toggleSort("category")}>
                분류 {sortKey === "category" ? (sortAsc ? "▲" : "▼") : ""}
              </th>
              <th style={th} onClick={() => toggleSort("foodName")}>
                식품명 {sortKey === "foodName" ? (sortAsc ? "▲" : "▼") : ""}
              </th>
              <th style={{ ...th, textAlign: "right" }} onClick={() => toggleSort("avgMgKg")}>
                평균 mg/kg {sortKey === "avgMgKg" ? (sortAsc ? "▲" : "▼") : ""}
              </th>
              <th style={th}>범위</th>
              <th style={{ ...th, textAlign: "right" }}>시료 수</th>
              <th style={th} onClick={() => toggleSort("analyzedAt")}>
                분석일 {sortKey === "analyzedAt" ? (sortAsc ? "▲" : "▼") : ""}
              </th>
              <th style={th}>비고</th>
            </tr>
          </thead>
          <tbody>
            {display.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#888" }}>
                  표시할 행이 없습니다.
                </td>
              </tr>
            ) : (
              display.map((r) => (
                <tr key={r.id} style={{ background: "#fff" }}>
                  <td style={{ borderBottom: "1px solid #eee", verticalAlign: "top" }}>
                    {r.category}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee", verticalAlign: "top" }}>
                    {r.foodName}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      verticalAlign: "top",
                    }}
                  >
                    {r.avgMgKg.toFixed(4).replace(/\.?0+$/, "")}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee", verticalAlign: "top" }}>
                    {r.rangeText}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      verticalAlign: "top",
                    }}
                  >
                    {r.sampleCount}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee", verticalAlign: "top" }}>
                    {r.analyzedAt}
                  </td>
                  <td style={{ borderBottom: "1px solid #eee", verticalAlign: "top", color: "#555" }}>
                    {r.note}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
