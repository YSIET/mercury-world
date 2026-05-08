"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 429) {
        setError("시도 횟수가 많습니다. 잠시 후 다시 시도해 주세요.");
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        width: 940,
        margin: "40px auto",
        fontFamily: "굴림, Gulim, sans-serif",
        fontSize: 14,
        color: "#333",
      }}
    >
      <h1 style={{ fontSize: 18, marginBottom: 20 }}>관리자 로그인</h1>
      <form
        onSubmit={onSubmit}
        style={{
          maxWidth: 360,
          padding: 24,
          border: "1px solid #dedede",
          background: "#fafafa",
        }}
      >
        <label style={{ display: "block", marginBottom: 8 }}>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              display: "block",
              width: "100%",
              marginTop: 6,
              padding: "8px 10px",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </label>
        {error && (
          <p style={{ color: "#c00", margin: "10px 0", fontSize: 13 }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 12,
            padding: "8px 20px",
            fontSize: 14,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}
