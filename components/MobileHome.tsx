import Link from "next/link";
import { getRecentBoardLinks, boardSectionHeading } from "@/lib/board";

/** 헤더 GNV TOP_GROUPS와 동일한 5개 대표 링크 */
const MOBILE_MENU_CARDS: { label: string; href: string }[] = [
  { label: "수은세상소개", href: "/site/greeting" },
  { label: "수은백서", href: "/mercury/mercury" },
  { label: "수은소식", href: "/news/board" },
  { label: "수은상담소", href: "/community/freeboard" },
  { label: "식품속수은", href: "/content/content" },
];

export default async function MobileHome() {
  const [noticeRecent, newsRecent, pdsRecent] = await Promise.all([
    getRecentBoardLinks("notice", 5),
    getRecentBoardLinks("news", 5),
    getRecentBoardLinks("pds", 5),
  ]);

  return (
    <div className="mw-mobile-home">
      <section className="mw-mob-intro">
        <h2>수은세상 (mercury world)</h2>
        <p>수은의 위험성과 안전한 관리에 관한 종합 정보를 제공합니다.</p>
      </section>

      <section className="mw-mob-board-section">
        <h3>
          <Link href="/news/board">{boardSectionHeading("notice")} →</Link>
        </h3>
        <ul>
          {noticeRecent.map((p, i) => (
            <li key={`${p.href}-${i}`}>
              <Link href={p.href}>{p.title}</Link>
              <span className="mw-mob-date">{p.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mw-mob-board-section">
        <h3>
          <Link href="/news/news">{boardSectionHeading("news")} →</Link>
        </h3>
        <ul>
          {newsRecent.map((p, i) => (
            <li key={`${p.href}-${i}`}>
              <Link href={p.href}>{p.title}</Link>
              <span className="mw-mob-date">{p.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mw-mob-board-section">
        <h3>
          <Link href="/news/pds">{boardSectionHeading("pds")} →</Link>
        </h3>
        <ul>
          {pdsRecent.map((p, i) => (
            <li key={`${p.href}-${i}`}>
              <Link href={p.href}>{p.title}</Link>
              <span className="mw-mob-date">{p.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mw-mob-menu-grid">
        {MOBILE_MENU_CARDS.map(({ label, href }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </section>
    </div>
  );
}
