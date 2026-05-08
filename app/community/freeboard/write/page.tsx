"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";

export default function QnaWritePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/qna/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        password: fd.get("password"),
        email: fd.get("email"),
        title: fd.get("title"),
        content: fd.get("content"),
        website: fd.get("website"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "오류가 발생했습니다.");
      setSubmitting(false);
      return;
    }
    router.push(`/community/freeboard/${data.id}`);
  }

  const cellTd: CSSProperties = {
    padding: 8,
    border: "1px solid #dedede",
    fontSize: 14,
  };
  const cellTh: CSSProperties = {
    background: "#f9f9f9",
    width: 100,
    padding: 8,
    border: "1px solid #dedede",
    fontSize: 14,
    fontWeight: "bold",
  };
  const inputStyle: CSSProperties = {
    fontSize: 14,
    padding: "4px 6px",
    fontFamily: "굴림",
  };

  return (
    <SubPageLayout
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/freeboard"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_1.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기 &gt; 글쓰기</>}
    >
      <div
        style={{
          width: 940,
          margin: "0 auto",
          fontFamily: "굴림",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        <h2
          style={{ fontSize: 16, fontWeight: "bold", margin: "20px 0 10px" }}
        >
          글쓰기
        </h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{
              position: "absolute",
              left: "-9999px",
              width: 1,
              height: 1,
            }}
          />
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid #dedede",
            }}
          >
            <tbody>
              <tr>
                <th style={cellTh}>작성자 *</th>
                <td style={cellTd}>
                  <input
                    name="name"
                    required
                    maxLength={50}
                    style={{ ...inputStyle, width: 200 }}
                  />
                </td>
                <th style={cellTh}>비밀번호 *</th>
                <td style={cellTd}>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={4}
                    maxLength={20}
                    style={{ ...inputStyle, width: 200 }}
                  />
                </td>
              </tr>
              <tr>
                <th style={cellTh}>이메일</th>
                <td colSpan={3} style={cellTd}>
                  <input
                    name="email"
                    type="email"
                    maxLength={100}
                    style={{ ...inputStyle, width: 400 }}
                  />
                </td>
              </tr>
              <tr>
                <th style={cellTh}>제목 *</th>
                <td colSpan={3} style={cellTd}>
                  <input
                    name="title"
                    required
                    maxLength={200}
                    style={{ ...inputStyle, width: "95%" }}
                  />
                </td>
              </tr>
              <tr>
                <th style={cellTh}>내용 *</th>
                <td colSpan={3} style={cellTd}>
                  <textarea
                    name="content"
                    required
                    rows={15}
                    style={{ ...inputStyle, width: "95%" }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {error && (
            <p style={{ color: "red", margin: "10px 0", fontSize: 14 }}>
              {error}
            </p>
          )}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{ fontSize: 14, padding: "6px 16px" }}
            >
              {submitting ? "등록 중..." : "등록"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              style={{ marginLeft: 8, fontSize: 14, padding: "6px 16px" }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </SubPageLayout>
  );
}
