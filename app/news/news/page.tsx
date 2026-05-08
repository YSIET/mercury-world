import SubPageLayout from "@/components/SubPageLayout";

const __HTML = `<!--con -->

<div class="board-placeholder">게시판 데이터 이관 후 표시됩니다.<br/>(원본: 카페24 게시판 모듈)</div>`;

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={1300}
      sideGroup={1300}
      activePath="/news/news"
      leftCategory="news"
      heroImg="/img/news/img.gif"
      titleImg="/img/news/title_2.gif"
      breadcrumb={<>HOME &gt; 수은소식 &gt; 수은관련뉴스</>}
    >
      <div dangerouslySetInnerHTML={{ __html: __HTML }} />
    </SubPageLayout>
  );
}
