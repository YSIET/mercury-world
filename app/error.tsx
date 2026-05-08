"use client";

import Link from "next/link";
import { useEffect } from "react";
import HeaderClient from "@/components/HeaderClient";
import Footer from "@/components/Footer";

const gulim = "'굴림', Gulim, sans-serif" as const;

const adminLinkStyle = {
  color: "#888888",
  fontSize: 13,
  textDecoration: "none" as const,
};

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      <HeaderClient
        activeGroup={null}
        activePath=""
        adminTopLinks={
          <>
            {" | "}
            <Link href="/admin/login" style={adminLinkStyle}>
              관리자 로그인
            </Link>
          </>
        }
      />
      <table
        width={940}
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ margin: "48px auto", fontFamily: gulim }}
      >
        <tbody>
          <tr>
            <td style={{ textAlign: "center", padding: "24px 16px" }}>
              <h1
                style={{
                  fontSize: 22,
                  color: "#333",
                  fontWeight: 700,
                  margin: "0 0 12px",
                }}
              >
                오류가 발생했습니다
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                }}
              >
                잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의
                바랍니다.
              </p>
              {isDev ? (
                <pre
                  style={{
                    textAlign: "left",
                    background: "#f6f6f6",
                    border: "1px solid #ddd",
                    padding: 12,
                    fontSize: 12,
                    color: "#922",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginBottom: 20,
                    maxWidth: "100%",
                  }}
                >
                  {error.message}
                </pre>
              ) : null}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => reset()}
                  style={{
                    padding: "10px 22px",
                    background: "#308BBC",
                    color: "#fff",
                    fontSize: 14,
                    border: "1px solid #2a7aa6",
                    cursor: "pointer",
                  }}
                >
                  다시 시도
                </button>
                <Link
                  href="/"
                  style={{
                    display: "inline-block",
                    padding: "10px 22px",
                    background: "#f0f0f0",
                    color: "#333",
                    fontSize: 14,
                    border: "1px solid #ccc",
                    textDecoration: "none",
                  }}
                >
                  홈으로
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ height: 60 }} />
      <Footer />
    </>
  );
}
