"use client";

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
      <div style={{ width: 940, margin: "0 auto", fontFamily: "굴림" }}>
        <h2 style={{ fontSize: 14, fontWeight: "bold", margin: "20px 0 10px" }}>
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
              fontSize: 12,
            }}
          >
            <tbody>
              <tr>
                <th
                  style={{
                    background: "#f9f9f9",
                    width: 80,
                    padding: 6,
                    border: "1px solid #dedede",
                  }}
                >
                  작성자 *
                </th>
                <td style={{ padding: 6, border: "1px solid #dedede" }}>
                  <input
                    name="name"
                    required
                    maxLength={50}
                    style={{ width: 200 }}
                  />
                </td>
                <th
                  style={{
                    background: "#f9f9f9",
                    width: 80,
                    padding: 6,
                    border: "1px solid #dedede",
                  }}
                >
                  비밀번호 *
                </th>
                <td style={{ padding: 6, border: "1px solid #dedede" }}>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={4}
                    maxLength={20}
                    style={{ width: 200 }}
                  />
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    background: "#f9f9f9",
                    padding: 6,
                    border: "1px solid #dedede",
                  }}
                >
                  이메일
                </th>
                <td
                  colSpan={3}
                  style={{ padding: 6, border: "1px solid #dedede" }}
                >
                  <input
                    name="email"
                    type="email"
                    maxLength={100}
                    style={{ width: 400 }}
                  />
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    background: "#f9f9f9",
                    padding: 6,
                    border: "1px solid #dedede",
                  }}
                >
                  제목 *
                </th>
                <td
                  colSpan={3}
                  style={{ padding: 6, border: "1px solid #dedede" }}
                >
                  <input
                    name="title"
                    required
                    maxLength={200}
                    style={{ width: "95%" }}
                  />
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    background: "#f9f9f9",
                    padding: 6,
                    border: "1px solid #dedede",
                  }}
                >
                  내용 *
                </th>
                <td
                  colSpan={3}
                  style={{ padding: 6, border: "1px solid #dedede" }}
                >
                  <textarea
                    name="content"
                    required
                    rows={15}
                    style={{ width: "95%", fontFamily: "굴림" }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {error && (
            <p style={{ color: "red", margin: "10px 0", fontSize: 12 }}>
              {error}
            </p>
          )}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button type="submit" disabled={submitting}>
              {submitting ? "등록 중..." : "등록"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              style={{ marginLeft: 8 }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </SubPageLayout>
  );
}
