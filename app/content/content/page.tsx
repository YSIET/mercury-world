import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '수은 콘텐츠' };

export default function ContentIndexPage() {
  return (
    <InfoPageLayout
      title="수은 콘텐츠"
      subtitle="카드뉴스·인포그래픽·영상 등 콘텐츠 모음"
      breadcrumbs={[{ label: '콘텐츠', href: '/content/content' }, { label: '수은 콘텐츠' }]}
      subNavTitle={SECTION_NAVS.content.title}
      subNavItems={[...SECTION_NAVS.content.items]}
    >
      <h2>콘텐츠 안내</h2>
      <p>
        수은과 관련된 카드뉴스, 인포그래픽, 영상 등 시각 콘텐츠를 제공합니다.
        업데이트되는 콘텐츠는 자료실 게시판(/bbs/mercury)에서도 함께 확인하실
        수 있습니다.
      </p>
      <h2>제공 형태</h2>
      <ul>
        <li>카드뉴스 — 사회관계망 공유용 이미지 시리즈</li>
        <li>인포그래픽 — 한 장으로 보는 수은 정보</li>
        <li>영상 — 짧은 안내 영상 / 강연 영상</li>
        <li>리플렛 — 인쇄용 PDF</li>
      </ul>
      <p className="muted">
        ※ 운영자가 콘텐츠 자료를 자료실 게시판에 업로드하면 이 페이지에 링크를
        추가할 수 있도록 구조가 준비되어 있습니다.
      </p>
    </InfoPageLayout>
  );
}
