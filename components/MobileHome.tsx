import Link from "next/link";
import {
  getRecentBoardLinks,
  boardSectionHeading,
  listPathForBoardType,
  type BoardType,
} from "@/lib/board";

const BOARD_MOBILE: BoardType[] = ["notice", "news", "pds"];

const MENU_CARDS: {
  label: string;
  href: string;
  icon: string;
  sub: string;
}[] = [
  { label: "수은세상소개", href: "/site/greeting", icon: "🏛️", sub: "인사말·사이트 안내" },
  { label: "수은백서", href: "/mercury/mercury", icon: "📘", sub: "수은이란·규제·응급" },
  { label: "수은소식", href: "/news/board", icon: "📰", sub: "공지·뉴스·함유량" },
  { label: "수은상담소", href: "/community/freeboard", icon: "💬", sub: "묻고답하기·의뢰" },
  { label: "수은IQ테스트", href: "/test/q", icon: "🧠", sub: "간단 퀴즈" },
];

export default async function MobileHome() {
  const [noticeRecent, newsRecent, pdsRecent] = await Promise.all([
    getRecentBoardLinks("notice", 3),
    getRecentBoardLinks("news", 3),
    getRecentBoardLinks("pds", 3),
  ]);

  const rows: Record<BoardType, typeof noticeRecent> = {
    notice: noticeRecent,
    news: newsRecent,
    pds: pdsRecent,
  };

  return (
    <div className="mw-mobile-home">
      <section className="mw-hero">
        <img src="/icon.png" alt="" className="mw-hero-logo" width={64} height={64} />
        <h1>수은세상</h1>
        <p className="mw-hero-tagline">mercury world</p>
        <p className="mw-hero-desc">
          수은의 위험성과 안전 관리에 관한
          <br />
          종합 정보를 제공합니다.
        </p>
        <Link href="/test/q" className="mw-hero-cta">
          <span className="mw-hero-cta-label">수은IQ테스트 시작 →</span>
        </Link>
      </section>

      {BOARD_MOBILE.map((type) => (
        <section key={type} className="mw-mob-board-section" aria-labelledby={`mw-board-${type}`}>
          <h3 id={`mw-board-${type}`}>
            <span>{boardSectionHeading(type)}</span>
            <Link href={listPathForBoardType(type)}>더보기</Link>
          </h3>
          <ul>
            {rows[type].map((p, i) => (
              <li key={`${p.href}-${i}`}>
                <Link href={p.href}>{p.title}</Link>
                <span className="mw-mob-date">{p.date}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mw-mob-menu-grid" aria-label="주요 메뉴">
        {MENU_CARDS.map(({ label, href, icon, sub }) => (
          <Link key={href} href={href} className="mw-mob-menu-card">
            <span className="icon" aria-hidden>
              {icon}
            </span>
            <p className="label">{label}</p>
            <p className="sub">{sub}</p>
          </Link>
        ))}
      </section>

      <section
        className="mw-mob-company-row"
        aria-label="회사 정보"
      >
        <img
          src="/og-image.png"
          alt="Mercury World"
          className="mw-mob-company-logo"
        />
        <div className="mw-mob-company-text">
          <p>
            <strong>(주)와이에스환경기술연구원 | KOLAS 인정 제364호</strong>
          </p>
          <p>연세대학교 화공생명공학과 첨단융합기술연구실</p>
          <p>
            Tel:{" "}
            <a href="tel:02-2123-7780">02-2123-7780</a>
          </p>
        </div>
      </section>
    </div>
  );
}
