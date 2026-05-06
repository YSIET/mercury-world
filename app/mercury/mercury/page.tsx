import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '수은이란?' };

export default function MercuryIntroPage() {
  return (
    <InfoPageLayout
      title="수은이란?"
      subtitle="원소 기호 Hg, 원자번호 80번의 중금속"
      breadcrumbs={[{ label: '수은이란', href: '/mercury/mercury' }, { label: '수은이란?' }]}
      subNavTitle={SECTION_NAVS.mercury.title}
      subNavItems={[...SECTION_NAVS.mercury.items]}
    >
      <h2>기본 정보</h2>
      <ul>
        <li>원소기호: Hg (Hydrargyrum)</li>
        <li>원자번호: 80</li>
        <li>상온에서 액체 상태로 존재하는 유일한 금속</li>
        <li>은백색 광택을 띠며, 비중이 높고 표면장력이 큼</li>
      </ul>
      <h2>주요 형태</h2>
      <ul>
        <li>금속 수은(Hg<sup>0</sup>) — 액체 또는 증기 형태</li>
        <li>무기 수은 화합물 — 염화제일수은, 염화제이수은 등</li>
        <li>유기 수은 화합물 — 메틸수은(MeHg), 에틸수은 등. 생체 내 축적이 잘 됨</li>
      </ul>
      <h2>건강 영향</h2>
      <p>
        수은은 노출 형태와 노출량에 따라 신경계, 신장, 면역계 등에 영향을 줄 수
        있습니다. 특히 메틸수은은 임산부와 영유아의 신경 발달에 영향을 미칠 수
        있어 주의가 필요합니다.
      </p>
      <p className="muted">
        ※ 본 페이지는 일반 정보 제공 목적으로, 의학적 진단·처치 정보는 전문가의
        상담을 받으시기 바랍니다.
      </p>
    </InfoPageLayout>
  );
}
