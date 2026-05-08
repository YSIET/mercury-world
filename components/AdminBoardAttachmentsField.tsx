"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import type { BoardAttachment } from "@/lib/board";

const btnStyle: CSSProperties = {
  fontSize: 13,
  padding: "4px 10px",
  cursor: "pointer",
  marginLeft: 8,
};

const MAX_BYTES = 1024 * 1024;

export default function AdminBoardAttachmentsField({
  items,
  onChange,
}: {
  items: BoardAttachment[];
  onChange: (next: BoardAttachment[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    setErr("");
    setBusy(true);
    try {
      const next = [...items];
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          setErr(`${file.name}: 1MB 이하만 업로드 가능`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        const d = (await r.json()) as {
          ok?: boolean;
          error?: string;
          name?: string;
          url?: string;
          size?: number;
        };
        if (!r.ok || !d.ok || !d.url || !d.name) {
          setErr(d.error ?? "업로드 실패");
          continue;
        }
        next.push({ name: d.name, url: d.url, size: d.size });
      }
      onChange(next);
    } finally {
      setBusy(false);
    }
  }

  function removeAt(i: number) {
    const next = items.filter((_, j) => j !== i);
    onChange(next);
  }

  return (
    <div>
      <label style={{ display: "block", marginBottom: 8 }}>
        첨부 파일 (각 1MB 이하, 여러 개 선택 가능)
        <br />
        <input
          type="file"
          multiple
          disabled={busy}
          onChange={(e) => {
            void onFilesSelected(e.target.files);
            e.target.value = "";
          }}
          style={{ marginTop: 6, fontSize: 14 }}
        />
      </label>
      {busy ? (
        <p style={{ fontSize: 13, color: "#666" }}>업로드 중…</p>
      ) : null}
      {err ? (
        <p style={{ fontSize: 13, color: "#c00" }}>{err}</p>
      ) : null}
      {items.length > 0 ? (
        <ul
          style={{
            margin: "12px 0 0",
            paddingLeft: 0,
            listStyle: "none",
            fontSize: 14,
          }}
        >
          {items.map((a, i) => (
            <li
              key={`${a.url}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 6,
                gap: 8,
              }}
            >
              <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bd1" }}>
                {a.name}
              </a>
              {a.size != null ? (
                <span style={{ color: "#888", fontSize: 12 }}>
                  {(a.size / 1024).toFixed(1)} KB
                </span>
              ) : null}
              <button
                type="button"
                style={btnStyle}
                onClick={() => removeAt(i)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: 13, color: "#888" }}>첨부 없음</p>
      )}
    </div>
  );
}
