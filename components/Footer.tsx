/**
 * 원본 inc/footer.php 미러
 * - copyright_1.gif (914 width)
 * - copyright_2.gif (809 wide) + footer_today.gif 통계 (자리표시자)
 */
export default function Footer() {
  return (
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
                      backgroundImage: "url(/img/common/footer_today.gif)",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* 원본은 statisticsShow('statistics.htm') — 추후 분석 통계 위젯 자리 */}
                    <span style={{ visibility: "hidden" }}>0</span>
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
