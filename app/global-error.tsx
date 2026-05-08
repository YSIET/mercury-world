"use client";

export default function GlobalError({
  error: _error,
  reset: _reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "'굴림', Gulim, sans-serif" }}>
        <div
          style={{
            maxWidth: 520,
            margin: "80px auto",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <p
            style={{ fontSize: 18, color: "#333", fontWeight: 700, marginBottom: 24 }}
          >
            치명적 오류 — 페이지를 새로고침해주세요
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 22px",
              background: "#308BBC",
              color: "#fff",
              fontSize: 14,
              border: "1px solid #2a7aa6",
              cursor: "pointer",
            }}
          >
            새로고침
          </button>
        </div>
      </body>
    </html>
  );
}
