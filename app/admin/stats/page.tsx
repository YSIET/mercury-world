import Link from "next/link";
import { getTodayStats } from "@/lib/stats";
import StatsAdminForms from "./StatsAdminForms";

export const dynamic = "force-dynamic";

async function logoutAction() {
  "use server";
  const { cookies } = await import("next/headers");
  const { redirect } = await import("next/navigation");
  const { ADMIN_COOKIE_NAME } = await import("@/lib/admin-auth");
  (await cookies()).set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  redirect("/admin/login");
}

export default async function AdminStatsPage() {
  const visit = await getTodayStats();
  const sumHist = visit.dailyHistory.reduce((a, r) => a + r.count, 0);

  return (
    <div
      className="mw-fluid-rail mw-admin-rail"
      style={{
        width: 940,
        margin: "24px auto",
        fontFamily: "굴림, Gulim, sans-serif",
        fontSize: 14,
        color: "#333",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h1 style={{ fontSize: 18, margin: 0 }}>방문 / 통계</h1>
          <Link href="/admin" style={{ fontSize: 13, color: "#007bd1" }}>
            ← 대시보드
          </Link>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{ fontSize: 13, padding: "6px 14px", cursor: "pointer" }}
          >
            로그아웃
          </button>
        </form>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, margin: "0 0 10px" }}>(A) 현재 값</h2>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>
            today (푸터 기준): <strong>{visit.today}</strong>
          </li>
          <li>
            total: <strong>{visit.total}</strong>
          </li>
          <li>
            가짜 일일 범위: <strong>{visit.fakeRange.min}</strong> ~{" "}
            <strong>{visit.fakeRange.max}</strong>
          </li>
        </ul>
      </section>

      <StatsAdminForms initial={visit} />

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 15, margin: "0 0 10px" }}>
          (D) 일자별 히스토리 (최근 30일, KST 날짜 키)
        </h2>
        {sumHist === 0 ? (
          <p style={{ color: "#888", margin: "8px 0" }}>
            이 구간에 기록된 방문 카운트가 없습니다. (history 미수집 또는 미방문일 수 있음)
          </p>
        ) : null}
        <div style={{ maxHeight: 280, overflow: "auto", border: "1px solid #ddd" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                  일자
                </th>
                <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #ccc" }}>
                  방문
                </th>
              </tr>
            </thead>
            <tbody>
              {visit.dailyHistory.map((row) => (
                <tr key={row.date} style={{ background: "#fff" }}>
                  <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                    {row.date}
                  </td>
                  <td
                    style={{
                      padding: "6px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                    }}
                  >
                    {row.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
