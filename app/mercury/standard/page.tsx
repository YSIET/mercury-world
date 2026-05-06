import InfoPageLayout, { SECTION_NAVS } from '@/components/InfoPageLayout';

export const metadata = { title: '수은 기준' };

export default function MercuryStandardPage() {
  return (
    <InfoPageLayout
      title="수은 기준"
      subtitle="국내외 관리 기준과 권고치 안내"
      breadcrumbs={[{ label: '수은이란', href: '/mercury/mercury' }, { label: '수은 기준' }]}
      subNavTitle={SECTION_NAVS.mercury.title}
      subNavItems={[...SECTION_NAVS.mercury.items]}
    >
      <h2>국제 협약</h2>
      <ul>
        <li>미나마타협약(Minamata Convention on Mercury) — 수은의 인위적 배출과 사용을 줄이기 위한 국제협약. 한국도 가입국.</li>
      </ul>
      <h2>식품 기준 (예시 영역)</h2>
      <p>
        식품의약품안전처(MFDS)는 어류 등 식품에 대해 총수은·메틸수은 기준을
        설정하고 있습니다. 어종별 기준은 정기적으로 개정되므로, 최신 고시를
        확인하시는 것이 좋습니다.
      </p>
      <h2>대기·수질·작업환경 기준</h2>
      <ul>
        <li>대기환경기준 — 환경부 고시</li>
        <li>수질·먹는물 — 환경부 / 식약처 고시</li>
        <li>작업환경 — 고용노동부 고시 (작업환경 노출 기준)</li>
      </ul>
      <p className="muted">
        ※ 구체적 수치는 관련 부처의 공식 고시·공시값을 참고해 주세요. 운영자는
        관리자 글쓰기를 통해 자료실(/bbs/mercury)에 최신 고시 PDF를 업로드할 수
        있습니다.
      </p>
    </InfoPageLayout>
  );
}
