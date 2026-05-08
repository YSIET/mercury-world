import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MENU_ITEMS } from "@/lib/menu-items";

const GROUP_LABEL: Record<number, string> = {
  1100: "수은세상소개",
  1200: "수은백서",
  1300: "수은소식",
  1400: "수은상담소",
  1500: "식품속수은",
};

export default function Sitemap() {
  const groups = [1200, 1300, 1400, 1500];
  return (
    <>
      <Header activeGroup={null} activePath="/sitemap" />

      <table
        width={940}
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ margin: "20px auto", textAlign: "left" }}
      >
        <tbody>
          <tr>
            <td>
              <h2 style={{ fontSize: 18, color: "#0099cc", margin: "20px 0" }}>
                SITEMAP
              </h2>
              <table width="100%" border={0} cellPadding={10} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td valign="top" width="20%">
                      <strong style={{ color: "#308BBC" }}>수은세상소개</strong>
                      <ul style={{ paddingLeft: 18, margin: "8px 0" }}>
                        <li>
                          <Link href="/site/greeting">인사말</Link>
                        </li>
                      </ul>
                    </td>
                    {groups.map((g) => (
                      <td key={g} valign="top" width="20%">
                        <strong style={{ color: "#308BBC" }}>
                          {GROUP_LABEL[g]}
                        </strong>
                        <ul style={{ paddingLeft: 18, margin: "8px 0" }}>
                          {MENU_ITEMS.filter(([gg]) => gg === g).map(
                            ([, label, href]) => (
                              <li key={href}>
                                <Link href={href}>{label}</Link>
                              </li>
                            )
                          )}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ height: 30 }} />
      <Footer />
    </>
  );
}
