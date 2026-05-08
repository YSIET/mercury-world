"use client";

import { useEffect, useState } from "react";

export default function VisitCounter() {
  const [data, setData] = useState<{ total: number; today: number } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/visit", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setData({ total: d.total, today: d.today }))
      .catch(() => {});
  }, []);

  return (
    <table width={120} border={0} cellSpacing={0} cellPadding={0}>
      <tbody>
        <tr>
          <td>
            <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
              <tbody>
                <tr style={{ height: 10 }}>
                  <td style={{ fontSize: 11, color: "#007bd1" }}>·TOTAL :</td>
                  <td
                    width={60}
                    align="right"
                    style={{ fontSize: 11, color: "#007bd1" }}
                  >
                    {data ? `${data.total}명` : "-"}
                  </td>
                </tr>
                <tr style={{ height: 10 }}>
                  <td style={{ fontSize: 11, color: "#007bd1" }}>·TODAY :</td>
                  <td
                    align="right"
                    style={{ fontSize: 11, color: "#007bd1" }}
                  >
                    {data ? `${data.today}명` : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
