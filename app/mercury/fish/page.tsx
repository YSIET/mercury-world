import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '어류 속 수은' };

export default function MercuryFishPage() {
  return (
    <InfoPageLayout
      title="어류 속 수은"
      subtitle="식품을 통한 메틸수은 노출 안내"
      breadcrumbs={[{ label: '수은이란', href: '/mercury/mercury' }, { label: '어류 속 수은' }]}
      subNavTitle={SECTION_NAVS.mercury.title}
      subNavItems={[...SECTION_NAVS.mercury.items]}
    >
      <h2>왜 어류에 수은이 축적되나요?</h2>
      <p>
        수계에서 생성된 메틸수은은 플랑크톤 → 작은 물고기 → 큰 물고기로 이어지는
        먹이사슬을 따라 체내에 축적됩니다. 일반적으로 수명이 길고 먹이사슬 상위에
        있는 대형 어류일수록 농도가 높은 경향이 있습니다.
      </p>
      <h2>일반적 권고사항(예시)</h2>
      <ul>
        <li>임산부·수유부·영유아는 대형 심해성 어류 섭취량을 조절</li>
        <li>다양한 어종을 골고루 섭취해 한쪽에 치우친 노출을 피하기</li>
        <li>일반인은 균형 잡힌 식단 안에서 어류 섭취를 권장 (오메가-3 등 영양 이점)</li>
      </ul>
      <p className="muted">
        ※ 구체적 어종별 권장 섭취량은 식품의약품안전처(MFDS) 등 공식 가이드를
        참고해 주세요. 본 페이지의 본문은 운영자가 최신 가이드 발표 시 갱신할 수
        있도록 일반적 안내만 담고 있습니다.
      </p>
    </InfoPageLayout>
  );
}
