import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  {
    label: '수은세상 소개',
    href: '/site/greeting',
    children: [{ label: '인사말', href: '/site/greeting' }],
  },
  {
    label: '수은이란',
    href: '/mercury/mercury',
    children: [
      { label: '수은이란?', href: '/mercury/mercury' },
      { label: '수은의 순환', href: '/mercury/cycle' },
      { label: '어류 속 수은', href: '/mercury/fish' },
      { label: '응급처치', href: '/mercury/emergency' },
      { label: '수은 기준', href: '/mercury/standard' },
    ],
  },
  {
    label: '콘텐츠',
    href: '/content/content',
    children: [
      { label: '수은 콘텐츠', href: '/content/content' },
      { label: '하루 섭취량', href: '/content/oneday' },
    ],
  },
  {
    label: '게시판',
    href: '/bbs/notice',
    children: [
      { label: '공지사항', href: '/bbs/notice' },
      { label: '관련 뉴스', href: '/bbs/news' },
      { label: '수은 자료실', href: '/bbs/mercury' },
      { label: 'Q&A', href: '/bbs/qna' },
      { label: '자료 요청', href: '/bbs/request' },
      { label: '키트 신청', href: '/bbs/kit' },
    ],
  },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="수은세상 홈">
          <span className="site-header__logo-mark" aria-hidden="true">Hg</span>
          <span className="site-header__logo-text">수은세상</span>
        </Link>
        <nav className="site-nav" aria-label="주 메뉴">
          <ul className="site-nav__list">
            {NAV.map((item) => (
              <li key={item.href} className="site-nav__item">
                <Link href={item.href} className="site-nav__link">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="site-nav__sub">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export { NAV };
