import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, ChevronRight, Droplets, Fish, Home, Menu, Search, ShieldCheck, X } from 'lucide-react';
import { foodData, menus, pages } from './data.js';
import './styles.css';

const navItems = [
  { key: 'about', label: '수은세상소개' },
  { key: 'mercury', label: '수은이란' },
  { key: 'cycle', label: '수은순환과 생물농축' },
  { key: 'fish', label: '어패류 속 수은' },
  { key: 'emergency', label: '응급처리법' },
  { key: 'regulation', label: '규제치' },
  { key: 'food', label: '섭취량 테스트' },
  { key: 'oneday', label: 'ONEDAY 신호등' },
  { key: 'news', label: '수은소식' },
  { key: 'clinic', label: '수은상담소' }
];

function Header({ current, setCurrent }) {
  const [open, setOpen] = useState(false);
  const go = (key) => {
    setCurrent(key);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="top-strip">
        <button onClick={() => go('home')}><Home size={14} /> HOME</button>
        <span>|</span>
        <button onClick={() => go('sitemap')}>SITEMAP</button>
      </div>
      <div className="brand-row">
        <button className="brand" onClick={() => go('home')} aria-label="수은세상 홈으로 이동">
          <span className="brand-mark">Hg</span>
          <span><strong>수은세상</strong><small>Mercury World</small></span>
        </button>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="메뉴 열기">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav className={`main-nav ${open ? 'is-open' : ''}`}>
        {menus.map((menu) => (
          <div className="nav-group" key={menu.id}>
            <button className={current === menu.id ? 'active' : ''} onClick={() => go(menu.id)}>{menu.label}</button>
            {menu.children && <div className="dropdown">{menu.children.map((child) => <span key={child}>{child}</span>)}</div>}
          </div>
        ))}
      </nav>
    </header>
  );
}

function Hero({ setCurrent }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">Mercury Information Portal</p>
        <h1>수은을 알고, 노출을 줄이고, 안전하게 대응합니다</h1>
        <p>기존 수은세상 홈페이지의 핵심 정보 구조를 유지하면서 모바일과 Vercel 배포에 맞게 새로 만든 반응형 웹사이트입니다.</p>
        <div className="hero-actions">
          <button onClick={() => setCurrent('mercury')}>수은백서 보기</button>
          <button className="secondary" onClick={() => setCurrent('food')}>섭취량 테스트</button>
        </div>
      </div>
      <div className="hero-card">
        <Droplets size={44} />
        <strong>Hg</strong>
        <span>상온에서 액체 상태로 존재하는 금속 원소</span>
      </div>
    </section>
  );
}

function HomePage({ setCurrent }) {
  const cards = [
    { key: 'mercury', icon: <Droplets />, title: '수은백서', text: '수은의 형태, 노출 경로, 건강 영향과 국내 배출 현황을 정리했습니다.' },
    { key: 'fish', icon: <Fish />, title: '어패류 속 수은', text: '메틸수은과 어패류 섭취 권고, 국내외 기준을 안내합니다.' },
    { key: 'emergency', icon: <AlertTriangle />, title: '응급처리법', text: '수은 유출 시 금지 행동과 표면별 처리 절차를 확인할 수 있습니다.' },
    { key: 'regulation', icon: <ShieldCheck />, title: '수은 규제치', text: '대기·수질·식품·토양·제품 기준을 표로 재정리했습니다.' }
  ];

  return (
    <>
      <Hero setCurrent={setCurrent} />
      <section className="section grid-section">
        {cards.map((card) => (
          <button className="feature-card" key={card.key} onClick={() => setCurrent(card.key)}>
            <span className="card-icon">{card.icon}</span>
            <strong>{card.title}</strong>
            <p>{card.text}</p>
            <span className="more">바로가기 <ChevronRight size={16} /></span>
          </button>
        ))}
      </section>
      <section className="section news-preview">
        <div>
          <p className="eyebrow">수은소식</p>
          <h2>최근 게시물</h2>
        </div>
        <ul>
          <li>실내공기 중 수은농도 측정 및 수은 관련 시험분석 안내</li>
          <li>'수은협약' 8월16일 정식 발효</li>
          <li>2013년 체결될 국제 수은 협약 공지</li>
        </ul>
      </section>
    </>
  );
}

function GenericPage({ page }) {
  return (
    <main className="page">
      <p className="breadcrumb">{page.eyebrow}</p>
      <h1>{page.title}</h1>
      <p className="intro">{page.intro}</p>
      {page.steps && <div className="steps">{page.steps.map((step, i) => <div className="step" key={step}><span>{i + 1}</span>{step}</div>)}</div>}
      {page.warnings && <div className="warning-grid">{page.warnings.map((warning) => <div className="warning" key={warning}><AlertTriangle size={18} />{warning}</div>)}</div>}
      {page.sections?.map((section) => <section className="content-block" key={section.heading}><h2>{section.heading}</h2>{section.body.map((p) => <p key={p}>{p}</p>)}</section>)}
      {page.placeholder && <div className="empty-state">게시판 데이터는 새 호스팅 환경에서 CMS 또는 GitHub 기반 콘텐츠 파일로 연결하면 됩니다.</div>}
    </main>
  );
}

function RegulationPage() {
  const page = pages.regulation;
  return (
    <main className="page">
      <p className="breadcrumb">{page.eyebrow}</p>
      <h1>{page.title}</h1>
      <p className="intro">{page.intro}</p>
      <div className="table-stack">
        {page.tables.map((table) => (
          <section className="table-card" key={table.title}>
            <div className="table-head"><h2>{table.title}</h2><span>{table.unit}</span></div>
            <table><tbody>{table.rows.map((row) => <tr key={row[0]}><th>{row[0]}</th><td>{row[1]}</td></tr>)}</tbody></table>
          </section>
        ))}
      </div>
    </main>
  );
}

function FoodCalculator() {
  const [weight, setWeight] = useState(60);
  const [query, setQuery] = useState('');
  const [amounts, setAmounts] = useState({});
  const filtered = foodData.filter((item) => item.name.includes(query.trim())).slice(0, 35);
  const selected = Object.entries(amounts).map(([id, amount]) => {
    const item = foodData.find((food) => food.id === Number(id));
    const intakeNg = Number(amount || 0) * item.mercury;
    return { ...item, amount: Number(amount || 0), intakeNg };
  }).filter((item) => item.amount > 0);
  const totalUg = selected.reduce((sum, item) => sum + item.intakeNg / 1000, 0);
  const perKg = weight > 0 ? totalUg / weight : 0;

  return (
    <main className="page">
      <p className="breadcrumb">{pages.food.eyebrow}</p>
      <h1>{pages.food.title}</h1>
      <p className="intro">{pages.food.intro}</p>
      <section className="calculator">
        <div className="calc-panel">
          <label>몸무게 kg<input type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
          <label className="search-label"><Search size={16} />식품 검색<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 고등어, 백미, 참치" /></label>
          <div className="food-list">
            {filtered.map((item) => (
              <label className="food-input" key={item.id}>
                <span>{item.name}<small>{item.mercury} ng/g</small></span>
                <input type="number" min="0" placeholder="g" value={amounts[item.id] || ''} onChange={(e) => setAmounts({ ...amounts, [item.id]: e.target.value })} />
              </label>
            ))}
          </div>
        </div>
        <aside className="result-card">
          <span>예상 총 섭취량</span>
          <strong>{totalUg.toFixed(3)} µg/day</strong>
          <p>체중 기준 {perKg.toFixed(4)} µg/kg/day</p>
          <ul>{selected.slice(0, 8).map((item) => <li key={item.id}>{item.name}: {(item.intakeNg / 1000).toFixed(3)} µg</li>)}</ul>
        </aside>
      </section>
    </main>
  );
}

function OneDayPage() {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => foodData.filter((item) => item.name.includes(query.trim())), [query]);
  return (
    <main className="page">
      <p className="breadcrumb">{pages.oneday.eyebrow}</p>
      <h1>{pages.oneday.title}</h1>
      <p className="intro">{pages.oneday.intro}</p>
      <label className="table-search"><Search size={16} />검색<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="식품명을 입력하세요" /></label>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>번호</th><th>식품</th><th>일일 소비량(g)</th><th>수은 평균 농도(ng/g)</th></tr></thead>
          <tbody>{rows.map((item) => <tr key={item.id}><td>{item.id}</td><th>{item.name}</th><td>{item.daily.toFixed(2)}</td><td>{item.mercury.toFixed(2)}</td></tr>)}</tbody>
        </table>
      </div>
    </main>
  );
}

function Sitemap({ setCurrent }) {
  return <main className="page"><p className="breadcrumb">HOME &gt; SITEMAP</p><h1>사이트맵</h1><div className="sitemap-grid">{navItems.map((item) => <button key={item.key} onClick={() => setCurrent(item.key)}>{item.label}<ChevronRight size={16} /></button>)}</div></main>;
}

function App() {
  const [current, setCurrent] = useState('home');
  let content;
  if (current === 'home') content = <HomePage setCurrent={setCurrent} />;
  else if (current === 'sitemap') content = <Sitemap setCurrent={setCurrent} />;
  else if (current === 'regulation') content = <RegulationPage />;
  else if (current === 'food') content = <FoodCalculator />;
  else if (current === 'oneday') content = <OneDayPage />;
  else content = <GenericPage page={pages[current] || pages.about} />;

  return (
    <div>
      <Header current={current} setCurrent={setCurrent} />
      {content}
      <footer className="footer">
        <strong>수은세상</strong>
        <p>Copyright Mercury World. Rebuilt as a static React site for modern hosting.</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
