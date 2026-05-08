import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const gulim = "'굴림', Gulim, sans-serif" as const;

export default function NotFound() {
  return (
    <>
      <Header activeGroup={null} activePath="" />
      <div className="mw-fluid-rail mw-simple-page-rail">
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
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  color: "#b0b0b0",
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                404
              </div>
              <h1
                style={{
                  fontSize: 22,
                  color: "#333",
                  fontWeight: 700,
                  margin: "0 0 12px",
                }}
              >
                페이지를 찾을 수 없습니다
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 1.6,
                  margin: "0 0 28px",
                }}
              >
                요청하신 페이지가 삭제되었거나 잘못된 경로일 수 있습니다.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link
                  href="/"
                  style={{
                    display: "inline-block",
                    padding: "10px 22px",
                    background: "#308BBC",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 14,
                    border: "1px solid #2a7aa6",
                  }}
                >
                  홈으로 돌아가기
                </Link>
                <Link
                  href="/sitemap"
                  style={{
                    fontSize: 14,
                    color: "#308BBC",
                    textDecoration: "underline",
                  }}
                >
                  사이트맵 보기
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <div style={{ height: 60 }} />
      <Footer />
    </>
  );
}
