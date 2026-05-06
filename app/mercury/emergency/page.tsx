import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '응급처치' };

export default function MercuryEmergencyPage() {
  return (
    <InfoPageLayout
      title="응급처치"
      subtitle="수은 누출·노출 시 대처 일반 가이드"
      breadcrumbs={[{ label: '수은이란', href: '/mercury/mercury' }, { label: '응급처치' }]}
      subNavTitle={SECTION_NAVS.mercury.title}
      subNavItems={[...SECTION_NAVS.mercury.items]}
    >
      <div className="notice-grid">
        ※ 본 페이지의 정보는 일반 안내이며, 실제 사고 발생 시에는 즉시
        119(소방)·1339(질병) 또는 환경부·관할 보건소에 연락하시기 바랍니다.
      </div>

      <h2>1. 가정 내 수은 온도계가 깨졌을 때</h2>
      <ul>
        <li>창문을 열어 환기시키고, 사람과 반려동물을 해당 공간에서 대피시킵니다.</li>
        <li>맨손으로 만지지 않고, 종이·테이프 등을 이용해 조심스럽게 모읍니다.</li>
        <li>진공청소기를 사용하지 않습니다(증기로 확산될 수 있음).</li>
        <li>모은 수은과 오염물은 밀봉하여 폐의약품·유해폐기물 회수 절차에 따라 처리합니다.</li>
      </ul>

      <h2>2. 노출이 의심될 때</h2>
      <ul>
        <li>증기 흡입이 의심되면 즉시 신선한 공기가 있는 곳으로 이동합니다.</li>
        <li>피부 접촉 시 흐르는 물로 충분히 씻어냅니다.</li>
        <li>증상(두통·떨림·구역 등)이 있으면 의료기관에 노출 사실을 알리고 진료받습니다.</li>
      </ul>

      <h2>3. 산업 누출·대량 누출</h2>
      <ul>
        <li>임의로 수습하지 말고 즉시 관할 소방·환경 당국에 신고합니다.</li>
        <li>오염 가능 공간은 출입을 통제합니다.</li>
      </ul>
    </InfoPageLayout>
  );
}
