"use client";

import type { CSSProperties } from "react";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";

export default function QnaEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const prompted = useRef(false);

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

  useEffect(() => {
    if (!id) return;
    if (prompted.current) return;
    prompted.current = true;

    const run = async () => {
      const gate =
        typeof window !== "undefined"
          ? window.prompt(
              "게시글을 수정하려면 비밀번호를 입력하세요. (저장 시 다시 확인됩니다.)",
              ""
            )
          : null;
      if (gate === null) {
        router.replace(`/community/freeboard/${id}`);
        return;
      }
      const res = await fetch(`/api/qna/posts/${id}`);
      if (!res.ok) {
        setError("글을 불러오지 못했습니다.");
        setLoading(false);
        return;
      }
      const d = await res.json();
      setTitle(d.title ?? "");
      setContent(d.content ?? "");
      setLoading(false);
    };
    void run();
  }, [id, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const res = await fetch(`/api/qna/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "오류가 발생했습니다.");
      setSubmitting(false);
      return;
    }
    router.push(`/community/freeboard/${id}`);
  }

  if (loading) {
    return (
      <SubPageLayout
        activeGroup={1400}
        sideGroup={1400}
        activePath="/community/freeboard"
        leftCategory="community"
        heroImg="/img/community/img.gif"
        titleImg="/img/community/title_1.gif"
        breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기 &gt; 수정</>}
      >
        <p style={{ padding: 20, fontSize: 14 }}>불러오는 중…</p>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/freeboard"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_1.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기 &gt; 수정</>}
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
          수정
        </h2>
        <form onSubmit={onSubmit}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid #dedede",
            }}
          >
            <tbody>
              <tr>
                <th style={cellTh}>비밀번호 *</th>
                <td colSpan={3} style={cellTd}>
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
                <th style={cellTh}>제목 *</th>
                <td colSpan={3} style={cellTd}>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
              {submitting ? "저장 중..." : "저장"}
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
