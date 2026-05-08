import SubPageLayout from "@/components/SubPageLayout";

const __HTML = `<!--con -->
	
	<table width="95%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td height="7" valign="top"><img src="/img/site/greeting_3.gif" /></td>
      </tr>
    </table>
	<br />`;

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={null}
      sideGroup={null}
      activePath="/site/greeting"
      leftCategory="site"
      heroImg="/img/site/img.gif"
      titleImg="/img/site/title_1.gif"
      breadcrumb={<>HOME &gt; 수은세상소개</>}
    >
      <div dangerouslySetInnerHTML={{ __html: __HTML }} />
    </SubPageLayout>
  );
}
