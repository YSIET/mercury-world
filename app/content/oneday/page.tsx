import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '하루 섭취량' };

export default function OneDayPage() {
  return (
    <InfoPageLayout
      title="하루 섭취량"
      subtitle="식품을 통한 수은 섭취량 가이드"
      breadcrumbs={[{ label: '콘텐츠', href: '/content/content' }, { label: '하루 섭취량' }]}
      subNavTitle={SECTION_NAVS.content.title}
      subNavItems={[...SECTION_NAVS.content.items]}
    >
      <h2>섭취량의 기준 개념</h2>
      <ul>
        <li>PTWI(잠정주간섭취허용량) — 1주일 동안 체중 1 kg당 안전하게 섭취 가능한 양</li>
        <li>RfD(참고용량) — 일일 노출 시 위해가 발생하지 않을 것으로 추정되는 양</li>
      </ul>
      <p>
        실제 권고 수치는 국제식량농업기구(FAO/WHO JECFA), 미국 EPA, 한국 식약처
        등 기관별로 차이가 있으며 정기적으로 갱신됩니다.
      </p>

      <h2>일반적 섭취 권고(요약)</h2>
      <ul>
        <li>일반인: 다양한 어종을 균형있게 섭취</li>
        <li>임산부·수유부: 대형 심해성 어류는 섭취량을 조절</li>
        <li>영유아: 체중 대비 섭취량을 고려해 어종 선택</li>
      </ul>
      <p className="muted">
        ※ 본 페이지의 수치 정보는 운영자가 최신 고시 발표 시 갱신할 수 있도록
        구조만 잡혀 있습니다. 정확한 값은 식약처 등 공식 고시를 참고해 주세요.
      </p>
    </InfoPageLayout>
  );
}
