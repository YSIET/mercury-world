import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '수은의 순환' };

export default function MercuryCyclePage() {
  return (
    <InfoPageLayout
      title="수은의 순환"
      subtitle="대기 → 수계 → 토양 → 생물 — 환경 속 수은의 이동"
      breadcrumbs={[{ label: '수은이란', href: '/mercury/mercury' }, { label: '수은의 순환' }]}
      subNavTitle={SECTION_NAVS.mercury.title}
      subNavItems={[...SECTION_NAVS.mercury.items]}
    >
      <h2>대기 중 수은</h2>
      <p>
        화석연료 연소, 산업 공정, 폐기물 소각, 자연 발생원 등에서 배출된 수은은
        주로 가스 상태로 대기 중에 머물며 장거리 이동이 가능합니다.
      </p>
      <h2>수계로의 침적</h2>
      <p>
        대기 중 수은은 강우·강설을 통해 지표면과 수계로 침적되며, 일부는 미생물
        작용에 의해 메틸수은으로 전환됩니다.
      </p>
      <h2>먹이사슬을 통한 농축</h2>
      <p>
        메틸수은은 수생태계 먹이사슬을 따라 농축되며, 상위 포식자(대형 어류)에서
        가장 높은 농도가 관찰됩니다.
      </p>
      <h2>인체로의 노출 경로</h2>
      <ul>
        <li>식품 — 어패류 섭취가 일반인의 가장 큰 메틸수은 노출 경로</li>
        <li>호흡 — 수은 증기 흡입 (직업 노출, 누출 사고)</li>
        <li>피부 접촉 — 일부 화장품·민간요법 등</li>
      </ul>
    </InfoPageLayout>
  );
}
