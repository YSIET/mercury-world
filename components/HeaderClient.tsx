"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { MENU_ITEMS } from "@/lib/menu-items";

const TOP_GROUPS: Array<{ group: number | null; label: string; href: string }> = [
  { group: null, label: "수은세상소개", href: "/site/greeting" },
  { group: 1200, label: "수은백서", href: "/mercury/mercury" },
  { group: 1300, label: "수은소식", href: "/news/board" },
  { group: 1400, label: "수은상담소", href: "/community/freeboard" },
  { group: 1500, label: "식품속수은", href: "/content/content" },
];

export interface HeaderClientProps {
  activeGroup?: number | null;
  activePath?: string;
  /** 서버에서 주입 (관리자 링크) */
  adminTopLinks?: ReactNode;
}

export default function HeaderClient({
  activeGroup,
  activePath,
  adminTopLinks,
}: HeaderClientProps) {
  const [iqQuickHover, setIqQuickHover] = useState(false);
  useEffect(() => {
    const $ = (window as any).$ || (window as any).jQuery;
    if (!$) return;

    $("#gnv dl")
      .off("mouseenter focusin mouseleave focusout")
      .on("mouseenter focusin", function (this: any) {
        $(this).find("dd").eq(0).stop().slideDown(150);
      })
      .on("mouseleave focusout", function (this: any) {
        $(this).find("dd").eq(0).stop().slideUp(30);
      });

    const handleScroll = () => {
      try {
        const elem = $("#quick_menu");
        const pos = $(window).scrollTop();
        if (pos === 0) {
          elem.stop().animate({ top: 100 }, 600);
        } else {
          elem.stop().animate({ top: pos + 100 }, 600);
        }
      } catch {
        // ignore
      }
    };
    $(window).on("scroll.mercuryQuick", handleScroll);

    return () => {
      $(window).off("scroll.mercuryQuick");
    };
  }, []);

  const renderSubMenu = (group: number) => {
    return MENU_ITEMS.filter(([g]) => g === group).map(([, label, href]) => (
      <Link key={href} href={href} className={activePath === href ? "on" : ""}>
        {label}
      </Link>
    ));
  };

  return (
    <>
      <div id="quick_menu">
        <ul>
          <li>
            <Link href="/site/greeting">
              <img src="/img/common/quick_1.gif" alt="수은세상소개" />
            </Link>
          </li>
          <li>
            <Link href="/community/freeboard">
              <img src="/img/common/quick_2.gif" alt="묻고답하기" />
            </Link>
          </li>
          <li>
            <Link
              href="/test/q"
              className="quick_menu_iq"
              onMouseEnter={() => setIqQuickHover(true)}
              onMouseLeave={() => setIqQuickHover(false)}
            >
              <img
                src={
                  iqQuickHover
                    ? "/img/common/quick_4_ov.gif"
                    : "/img/common/quick_4.gif"
                }
                alt="수은IQ테스트"
              />
            </Link>
          </li>
          <li>
            <Link href="/community/request">
              <img src="/img/common/quick_3.gif" alt="분석의뢰" />
            </Link>
          </li>
        </ul>
        <div className="top" onClick={() => window.scrollTo(0, 0)}>
          <img src="/img/common/top.gif" alt="top" />
        </div>
      </div>

      <div
        id="pop_wrapper"
        style={{ width: "940px", height: "1px", position: "relative", zIndex: 9 }}
      />

      <div className="header">
        <div className="bt_top">
          <Link href="/">HOME</Link> | <Link href="/sitemap">SITEMAP</Link>
          {adminTopLinks}
        </div>
        <div className="logo">
          <Link href="/">
            <img src="/img/img_new/logo.gif" alt="수은세상 로고" />
          </Link>
        </div>

        <div className="gnv" id="gnv">
          {TOP_GROUPS.map((g) => {
            const isActive = activeGroup === g.group;
            return (
              <dl key={g.label}>
                <dt className={isActive ? "on" : ""}>
                  <Link href={g.href}>{g.label}</Link>
                </dt>
                {g.group !== null && <dd>{renderSubMenu(g.group)}</dd>}
              </dl>
            );
          })}
          <div className="g_clear_both" />
        </div>
        <div className="g_clear_both" />
      </div>
    </>
  );
}

/**
 * 좌측 사이드 메뉴 (서브 페이지에서 사용)
 */
export function SideNav({
  group,
  activePath,
}: {
  group: number;
  activePath: string;
}) {
  const items = MENU_ITEMS.filter(([g]) => g === group);
  return (
    <ul className="side_nav">
      {items.map(([, label, href]) => (
        <li key={href}>
          <Link href={href} className={activePath === href ? "on" : ""}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
