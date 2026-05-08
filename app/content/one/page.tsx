import SubPageLayout from "@/components/SubPageLayout";
import { signalStatic } from "@/lib/signal";

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={1500}
      sideGroup={1500}
      activePath="/content/one"
      leftCategory="content"
      heroImg="/img/content/img.gif"
      titleImg="/img/content/title_2.gif"
      breadcrumb={<>HOME &gt; 식품속수은 &gt; ONEDAY수은신호등</>}
    >
      <div style={{ maxWidth: 800, margin: "20px auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <img src="/img/content/sinho.gif" alt="" />
        </div>
        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 14,
          }}
        >
          식품분석 결과
        </p>
        <table
          width="100%"
          cellPadding={4}
          cellSpacing={0}
          style={{
            borderCollapse: "collapse",
            borderTop: "2px solid #5fb3b3",
            borderBottom: "2px solid #5fb3b3",
          }}
        >
          <thead>
            <tr style={{ background: "#DCF3F3" }}>
              <th style={{ padding: 6 }} width="10%">
                번호
              </th>
              <th width="40%">식품</th>
              <th width="20%">
                일일
                <br />
                소비량(g)
              </th>
              <th width="30%">
                수은평균
                <br />
                농도(ng/g)
              </th>
            </tr>
          </thead>
          <tbody>
            {signalStatic.map((r, i) => (
              <tr
                key={r.rank}
                style={{ background: i % 2 ? "#F7F7F7" : "white" }}
              >
                <td align="center" style={{ padding: 3 }}>
                  {r.rank}
                </td>
                <td align="center">{r.food}</td>
                <td align="center">{r.daily_intake_g.toFixed(2)}</td>
                <td align="center" style={{ color: "#FF0066" }}>
                  {r.mercury_ng_g.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p
          style={{
            fontSize: 11,
            color: "#999",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          (이 값은 식품별 수은 농도 측정 결과 기반 추정치)
        </p>
      </div>
    </SubPageLayout>
  );
}
