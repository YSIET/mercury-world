"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SubPageLayoutClient from "@/components/SubPageLayoutClient";

export default function QnaEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [post, setPost] = useState<{ title: string; content: string } | null>(
    null
  );
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const [unlockPwd, setUnlockPwd] = useState("");
  const [unlockErr, setUnlockErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/qna/posts/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) {
          setError("글을 찾을 수 없습니다.");
          return;
        }
        if (d.locked) {
          setNeedsUnlock(true);
          setPost({ title: d.title, content: "" });
        } else {
          setPost({ title: d.title, content: d.content ?? "" });
        }
      })
      .catch(() => setError("글을 불러오지 못했습니다."));
  }, [id]);

  async function onUnlock(e: React.FormEvent) {
    e.preventDefault();
    setUnlockErr("");
    const res = await fetch(`/api/qna/posts/${id}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: unlockPwd }),
    });
    const data = await res.json();
    if (!res.ok) {
      setUnlockErr(data.error ?? "오류가 발생했습니다.");
      return;
    }
    setPost((p) => (p ? { ...p, content: data.content } : null));
    setNeedsUnlock(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/qna/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        content: fd.get("content"),
        password: fd.get("password"),
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

  if (!post) {
    return (
      <SubPageLayoutClient
        activeGroup={1400}
        sideGroup={1400}
        activePath="/community/freeboard"
        leftCategory="community"
        heroImg="/img/community/img.gif"
        titleImg="/img/community/title_1.gif"
        breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기 &gt; 수정</>}
      >
        <div className="mw-prose" style={{ width: 940, margin: "20px auto", fontSize: 14 }}>
          {error || "불러오는 중..."}
        </div>
      </SubPageLayoutClient>
    );
  }

  const cellTd = {
    padding: 8,
    border: "1px solid #dedede",
    fontSize: 14,
  } as const;
  const cellTh = {
    background: "#f9f9f9",
    width: 100,
    padding: 8,
    border: "1px solid #dedede",
    fontSize: 14,
    fontWeight: "bold" as const,
  };
  const inputStyle = {
    fontSize: 14,
    padding: "4px 6px",
    fontFamily: "굴림",
  } as const;

  return (
    <SubPageLayoutClient
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/freeboard"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_1.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기 &gt; 수정</>}
    >
      <div
        className="mw-prose"
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
          글 수정
        </h2>

        {needsUnlock && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "#f9f9f9",
              border: "1px solid #ddd",
            }}
          >
            <p style={{ marginBottom: 8 }}>비밀글입니다. 수정하려면 먼저 열람 비밀번호를 입력하세요.</p>
            <form onSubmit={onUnlock} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <input
                type="password"
                value={unlockPwd}
                onChange={(e) => setUnlockPwd(e.target.value)}
                style={{ padding: "4px 8px", fontSize: 14 }}
                required
              />
              <button type="submit" style={{ fontSize: 14, padding: "6px 16px" }}>
                열람
              </button>
            </form>
            {unlockErr && (
              <p style={{ color: "red", marginTop: 8, fontSize: 13 }}>{unlockErr}</p>
            )}
          </div>
        )}

        {!needsUnlock && (
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
                  <td style={cellTd} colSpan={3}>
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={4}
                      maxLength={20}
                      style={{ ...inputStyle, width: 200 }}
                    />
                    <span
                      style={{ color: "#666", marginLeft: 8, fontSize: 13 }}
                    >
                      (작성 시 입력한 비밀번호)
                    </span>
                  </td>
                </tr>
                <tr>
                  <th style={cellTh}>제목 *</th>
                  <td colSpan={3} style={cellTd}>
                    <input
                      name="title"
                      required
                      maxLength={200}
                      defaultValue={post.title}
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
                      defaultValue={post.content}
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
        )}
      </div>
    </SubPageLayoutClient>
  );
}
