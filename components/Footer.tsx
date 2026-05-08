import VisitCounter from "./VisitCounter";

/**
 * 원본 inc/footer.php 미러
 * - copyright_1.gif (914 width)
 * - copyright_2.gif (809 wide) + footer_today.gif 통계 (KV 방문 카운터)
 */
export default function Footer() {
  return (
    <div className="mw-fluid-rail mw-footer-rail">
      <table
      width={914}
      border={0}
      cellSpacing={0}
      cellPadding={0}
      style={{ margin: "0 auto" }}
    >
      <tbody>
        <tr>
          <td colSpan={2}>
            <img src="/img/common/copyright_1.gif" alt="copyright" />
          </td>
        </tr>
        <tr>
          <td width={809} height={90} valign="top">
            <img src="/img/common/copyright_2.gif" alt="저작권 정보" />
          </td>
          <td width={150} valign="top">
            <table width={128} height={37} border={0} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td
                    align="center"
                    style={{
                      background: "url(/img/common/footer_today.gif) no-repeat",
                      height: 37,
                    }}
                  >
                    <VisitCounter />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  );
}
