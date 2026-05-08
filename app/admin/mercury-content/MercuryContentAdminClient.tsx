"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent, type CSSProperties } from "react";
import type { MercuryContentRow } from "@/lib/mercury-content";

const emptyForm = {
  category: "",
  foodName: "",
  avgMgKg: "",
  rangeText: "",
  sampleCount: "",
  analyzedAt: "",
  note: "",
  sourcePostId: "",
};

export default function MercuryContentAdminClient() {
  const [rows, setRows] = useState<MercuryContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<MercuryContentRow>>({});
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/mercury-content", { credentials: "include" });
    const d = (await r.json()) as { rows?: MercuryContentRow[] };
    setRows(d.rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addRow(e: FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/admin/mercury-content", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: form.category,
        foodName: form.foodName,
        avgMgKg: parseFloat(form.avgMgKg),
        rangeText: form.rangeText,
        sampleCount: parseInt(form.sampleCount, 10),
        analyzedAt: form.analyzedAt,
        note: form.note,
        sourcePostId: form.sourcePostId || undefined,
      }),
    });
    const d = (await r.json()) as { error?: string };
    if (!r.ok) {
      setErr(d.error ?? "추가 실패");
      return;
    }
    setForm(emptyForm);
    await load();
  }

  async function saveEdit(id: string) {
    setErr("");
    const r = await fetch(`/api/admin/mercury-content/${encodeURIComponent(id)}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    const d = (await r.json()) as { error?: string };
    if (!r.ok) {
      setErr(d.error ?? "저장 실패");
      return;
    }
    setEditingId(null);
    setEditDraft({});
    await load();
  }

  async function remove(id: string) {
    if (!confirm("이 행을 삭제할까요?")) return;
    setErr("");
    const r = await fetch(`/api/admin/mercury-content/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!r.ok) {
      setErr("삭제 실패");
      return;
    }
    await load();
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    maxWidth: 200,
    boxSizing: "border-box",
    padding: "4px 6px",
    fontSize: 13,
  };

  if (loading) {
    return <p style={{ padding: 24 }}>불러오는 중…</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <p style={{ marginBottom: 16 }}>
        <Link href="/admin" style={{ color: "#007bd1", fontSize: 13 }}>
          ← 대시보드
        </Link>
        {" · "}
        <Link href="/content/mercury" style={{ color: "#007bd1", fontSize: 13 }}>
          공개 페이지 보기
        </Link>
      </p>

      <h1 style={{ fontSize: 18, marginBottom: 8 }}>수은함유량 데이터 편집</h1>
      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
        KV 키: <code>mercury:content:rows</code> (ZSET) +{" "}
        <code>mercury:content:row:{"{id}"}</code>
      </p>

      {err ? (
        <p style={{ color: "#c00", marginBottom: 12, fontSize: 14 }}>{err}</p>
      ) : null}

      <table
        width="100%"
        cellPadding={4}
        cellSpacing={0}
        style={{ borderCollapse: "collapse", fontSize: 13, marginBottom: 28 }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th align="left">분류</th>
            <th align="left">식품명</th>
            <th align="right">평균</th>
            <th align="left">범위</th>
            <th align="right">시료</th>
            <th align="left">분석일</th>
            <th align="left">비고</th>
            <th align="left">동작</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            editingId === row.id ? (
              <tr key={row.id} style={{ background: "#fffbea" }}>
                <td>
                  <input
                    style={inputStyle}
                    value={editDraft.category ?? row.category}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, category: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <input
                    style={inputStyle}
                    value={editDraft.foodName ?? row.foodName}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, foodName: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <input
                    style={{ ...inputStyle, maxWidth: 80 }}
                    type="number"
                    step="any"
                    value={
                      editDraft.avgMgKg !== undefined
                        ? editDraft.avgMgKg
                        : row.avgMgKg
                    }
                    onChange={(e) =>
                      setEditDraft((d) => ({
                        ...d,
                        avgMgKg: parseFloat(e.target.value),
                      }))
                    }
                  />
                </td>
                <td>
                  <input
                    style={inputStyle}
                    value={editDraft.rangeText ?? row.rangeText}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, rangeText: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <input
                    style={{ ...inputStyle, maxWidth: 60 }}
                    type="number"
                    value={
                      editDraft.sampleCount !== undefined
                        ? editDraft.sampleCount
                        : row.sampleCount
                    }
                    onChange={(e) =>
                      setEditDraft((d) => ({
                        ...d,
                        sampleCount: parseInt(e.target.value, 10),
                      }))
                    }
                  />
                </td>
                <td>
                  <input
                    style={inputStyle}
                    value={editDraft.analyzedAt ?? row.analyzedAt}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, analyzedAt: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <input
                    style={inputStyle}
                    value={editDraft.note ?? row.note}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, note: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    style={{ fontSize: 12, marginRight: 6 }}
                    onClick={() => saveEdit(row.id)}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: 12 }}
                    onClick={() => {
                      setEditingId(null);
                      setEditDraft({});
                    }}
                  >
                    취소
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={row.id}>
                <td>{row.category}</td>
                <td>{row.foodName}</td>
                <td align="right">{row.avgMgKg}</td>
                <td>{row.rangeText}</td>
                <td align="right">{row.sampleCount}</td>
                <td>{row.analyzedAt}</td>
                <td style={{ maxWidth: 200 }}>{row.note}</td>
                <td>
                  <button
                    type="button"
                    style={{ fontSize: 12, marginRight: 6 }}
                    onClick={() => {
                      setEditingId(row.id);
                      setEditDraft({});
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: 12 }}
                    onClick={() => remove(row.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>행 추가</h2>
      <form onSubmit={addRow}>
        <table cellPadding={6}>
          <tbody>
            <tr>
              <td>분류</td>
              <td>
                <input
                  required
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                />
              </td>
            </tr>
            <tr>
              <td>식품명</td>
              <td>
                <input
                  required
                  style={inputStyle}
                  value={form.foodName}
                  onChange={(e) => setForm((f) => ({ ...f, foodName: e.target.value }))}
                />
              </td>
            </tr>
            <tr>
              <td>평균 mg/kg</td>
              <td>
                <input
                  required
                  type="number"
                  step="any"
                  style={inputStyle}
                  value={form.avgMgKg}
                  onChange={(e) => setForm((f) => ({ ...f, avgMgKg: e.target.value }))}
                />
              </td>
            </tr>
            <tr>
              <td>범위</td>
              <td>
                <input
                  style={inputStyle}
                  value={form.rangeText}
                  onChange={(e) => setForm((f) => ({ ...f, rangeText: e.target.value }))}
                />
              </td>
            </tr>
            <tr>
              <td>시료 수</td>
              <td>
                <input
                  required
                  type="number"
                  style={inputStyle}
                  value={form.sampleCount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sampleCount: e.target.value }))
                  }
                />
              </td>
            </tr>
            <tr>
              <td>분석일</td>
              <td>
                <input
                  required
                  placeholder="YYYY-MM-DD"
                  style={inputStyle}
                  value={form.analyzedAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, analyzedAt: e.target.value }))
                  }
                />
              </td>
            </tr>
            <tr>
              <td>비고</td>
              <td>
                <input
                  style={inputStyle}
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                />
              </td>
            </tr>
            <tr>
              <td>출처 글 id</td>
              <td>
                <input
                  style={inputStyle}
                  placeholder="선택"
                  value={form.sourcePostId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sourcePostId: e.target.value }))
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          <button type="submit" style={{ padding: "8px 16px", fontSize: 14 }}>
            추가
          </button>
        </p>
      </form>
    </div>
  );
}
