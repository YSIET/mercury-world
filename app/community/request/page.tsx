import SubPageLayout from "@/components/SubPageLayout";

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/request"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_2.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 분석의뢰</>}
    >
      <table width={700} border={0} cellSpacing={0} cellPadding={0}>
        <tbody>
          <tr>
            <td height={30} align="center">
              <img src="/img/community/request_1.gif" alt="" />
            </td>
          </tr>
          <tr>
            <td height={27} />
          </tr>
        </tbody>
      </table>
      <table
        width={697}
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ border: "solid 5px #eeeeee" }}
      >
        <tbody>
          <tr>
            <td>
              <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr>
                    <td style={{ padding: 10 }}>
                      <img src="/img/community/request_2.gif" alt="" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </SubPageLayout>
  );
}
