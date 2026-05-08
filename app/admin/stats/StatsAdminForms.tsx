"use client";

import type { TodayStatsBundle } from "@/lib/stats";
import { useState } from "react";

export default function StatsAdminForms({
  initial,
}: {
  initial: TodayStatsBundle;
}) {
  const [todayVal, setTodayVal] = useState(String(initial.today));
  const [totalVal, setTotalVal] = useState(String(initial.total));
  const [fakeMin, setFakeMin] = useState(String(initial.fakeRange.min));
  const [fakeMax, setFakeMax] = useState(String(initial.fakeRange.max));
  const [note, setNote] = useState<string | null>(null);

  async function postJson(url: string, body: object) {
    setNote(null);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (r.ok) {
      setNote("✓ 저장됨");
      return true;
    }
    setNote("저장 실패");
    return false;
  }

  const inp = {
    width: 120,
    padding: "6px 8px",
    fontSize: 14,
    fontFamily: "굴림, Gulim, sans-serif",
  } as const;

  const btn = {
    marginLeft: 8,
    padding: "6px 14px",
    fontSize: 13,
    fontFamily: "굴림, Gulim, sans-serif",
    cursor: "pointer",
  } as const;

  return (
    <div style={{ fontSize: 14, lineHeight: 1.7 }}>
      {note ? (
        <p style={{ color: "#080", margin: "0 0 12px", fontWeight: "bold" }}>{note}</p>
      ) : null}

      <h2 style={{ fontSize: 15, margin: "20px 0 10px" }}>(B) 값 수정</h2>
      <p style={{ margin: "8px 0" }}>
        <span style={{ display: "inline-block", width: 160 }}>오늘 방문수 set</span>
        <input
          type="number"
          min={0}
          value={todayVal}
          onChange={(e) => setTodayVal(e.target.value)}
          style={inp}
        />
        <button
          type="button"
          style={btn}
          onClick={async () => {
            const n = parseInt(todayVal, 10);
            if (!Number.isFinite(n) || n < 0) return;
            await postJson("/api/admin/stats/today", { today: n });
          }}
        >
          저장
        </button>
      </p>
      <p style={{ margin: "8px 0" }}>
        <span style={{ display: "inline-block", width: 160 }}>총 방문수 set</span>
        <input
          type="number"
          min={0}
          value={totalVal}
          onChange={(e) => setTotalVal(e.target.value)}
          style={inp}
        />
        <button
          type="button"
          style={btn}
          onClick={async () => {
            const n = parseInt(totalVal, 10);
            if (!Number.isFinite(n) || n < 0) return;
            await postJson("/api/admin/stats/total", { total: n });
          }}
        >
          저장
        </button>
      </p>

      <h2 style={{ fontSize: 15, margin: "24px 0 10px" }}>
        (C) 일일 가짜 증가 범위
      </h2>
      <p style={{ margin: "8px 0", color: "#555" }}>
        자정 이후 첫 방문 요청 시 총계·오늘치에 더해지는 난수 범위 (기본 1–5).
      </p>
      <p style={{ margin: "8px 0" }}>
        <span style={{ display: "inline-block", width: 160 }}>최소</span>
        <input
          type="number"
          min={0}
          value={fakeMin}
          onChange={(e) => setFakeMin(e.target.value)}
          style={inp}
        />
        <span style={{ margin: "0 12px 0 8px" }}>/ 최대</span>
        <input
          type="number"
          min={0}
          value={fakeMax}
          onChange={(e) => setFakeMax(e.target.value)}
          style={inp}
        />
        <button
          type="button"
          style={btn}
          onClick={async () => {
            const min = parseInt(fakeMin, 10);
            const max = parseInt(fakeMax, 10);
            if (!Number.isFinite(min) || !Number.isFinite(max)) return;
            await postJson("/api/admin/stats/fake-range", { min, max });
          }}
        >
          저장
        </button>
      </p>
    </div>
  );
}
