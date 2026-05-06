import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '인사말' };

export default function GreetingPage() {
  return (
    <InfoPageLayout
      title="인사말"
      subtitle="수은세상을 찾아주신 여러분을 환영합니다."
      breadcrumbs={[{ label: '수은세상 소개', href: '/site/greeting' }, { label: '인사말' }]}
      subNavTitle={SECTION_NAVS.site.title}
      subNavItems={[...SECTION_NAVS.site.items]}
    >
      <h2>안녕하세요, 수은세상입니다.</h2>
      <p>
        수은세상은 일상 속 수은 노출에 대해 누구나 쉽게 이해할 수 있도록 정보를
        모아 제공하는 안내 페이지입니다. 수은의 기본 성질부터, 환경 속 순환,
        식품을 통한 노출, 응급 상황 대처 방법, 국내외 관리 기준까지 한 곳에서
        확인하실 수 있습니다.
      </p>
      <p>
        본 페이지는 비영리 정보 제공 목적으로 운영되며, 게시판을 통해 의견과
        질문을 자유롭게 남겨주실 수 있습니다.
      </p>
      <h2>주요 메뉴 안내</h2>
      <ul>
        <li>수은이란 — 수은의 정의, 순환, 어류 속 수은, 응급처치, 관리 기준</li>
        <li>콘텐츠 — 수은 관련 자료와 일일 섭취량 가이드</li>
        <li>게시판 — 공지, 뉴스, 자료실, Q&amp;A, 자료 요청, 키트 신청</li>
      </ul>
      <p className="muted" style={{ marginTop: 24 }}>
        ※ 본 페이지의 인사말 본문은 사이트 운영자가 자유롭게 교체할 수 있도록
        구성되어 있습니다. (관리자 글쓰기에서 공지로 작성 시 홈에도 노출됩니다.)
      </p>
    </InfoPageLayout>
  );
}
