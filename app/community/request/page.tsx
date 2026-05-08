import SubPageLayout from "@/components/SubPageLayout";

const __HTML = `<!--con -->
	
	<table width="700" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="30" align="center"><img src="/img/community/request_1.gif" /></td>
      </tr>
	  <tr>
        <td height="27"></td>
      </tr>
    </table>
	<table width="697" border="0" cellpadding="0" cellspacing="0"  style="border:solid 5 #eeeeee;">
      <tr>
        <td>
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  <tr>
			<td style="padding: 10 10 10 10"><img src="/img/community/request_2.gif" /></td>
		    </tr>
		</table>

		</td>
      </tr>
    </table>`;

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
      <div dangerouslySetInnerHTML={{ __html: __HTML }} />
    </SubPageLayout>
  );
}
