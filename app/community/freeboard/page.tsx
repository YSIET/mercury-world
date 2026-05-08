import SubPageLayout from "@/components/SubPageLayout";

const __HTML = `<!--con -->
	
	<table width="100%" height="20" border="0" cellspacing="0" cellpadding="0">
	  <tr>
		<td valign="top" style="padding-bottom:5"><img src="/img/community/text_1.gif" /></td>
	  </tr>
	</table>

<!-- <div class="board-placeholder">게시판 데이터 이관 후 표시됩니다.<br/>(원본: 카페24 게시판 모듈)</div> -->
<div class="board-placeholder">게시판 데이터 이관 후 표시됩니다.<br/>(원본: 카페24 게시판 모듈)</div>`;

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/freeboard"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_1.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기</>}
    >
      <div dangerouslySetInnerHTML={{ __html: __HTML }} />
    </SubPageLayout>
  );
}
