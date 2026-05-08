"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 원본 inc/header.php의 메뉴 배열 그대로 미러링
 * group: 1100=수은세상소개(없음), 1200=수은백서, 1300=수은소식, 1400=수은상담소, 1500=식품속수은
 */
export const MENU_ITEMS: Array<[number, string, string]> = [
  [1200, "수은이란", "/mercury/mercury"],
  [1200, "수은순환과생물농축", "/mercury/mercury_cycle"],
  [1200, "어패류속수은", "/mercury/fish"],
  [1200, "수은응급처리법", "/mercury/emergency"],
  [1200, "수은규제치", "/mercury/regulation"],

  [1300, "공지사항", "/news/board"],
  [1300, "수은관련뉴스", "/news/news"],
  [1300, "수은함유량정보", "/news/pds"],

  [1400, "묻고답하기", "/community/freeboard"],
  [1400, "분석의뢰", "/community/request"],
  [1400, "수은응급처리키트", "/community/kit"],

  [1500, "수은섭취량테스트", "/content/content"],
  [1500, "ONEDAY수은신호등", "/content/one"],
];

const TOP_GROUPS: Array<{ group: number | null; label: string; href: string }> = [
  { group: null, label: "수은세상소개", href: "/site/greeting" },
  { group: 1200, label: "수은백서", href: "/mercury/mercury" },
  { group: 1300, label: "수은소식", href: "/news/board" },
  { group: 1400, label: "수은상담소", href: "/community/freeboard" },
  { group: 1500, label: "식품속수은", href: "/content/content" },
];

interface HeaderProps {
  activeGroup?: number | null;
  activePath?: string;
}

export default function Header({ activeGroup, activePath }: HeaderProps) {
  const [iqQuickHover, setIqQuickHover] = useState(false);
  // 원본 jQuery hover/scroll 동작 재현
  useEffect(() => {
    const $ = (window as any).$ || (window as any).jQuery;
    if (!$) return;

    // 메뉴 hover: dd 슬라이드 다운/업
    $("#gnv dl")
      .off("mouseenter focusin mouseleave focusout")
      .on("mouseenter focusin", function (this: any) {
        $(this).find("dd").eq(0).stop().slideDown(150);
      })
      .on("mouseleave focusout", function (this: any) {
        $(this).find("dd").eq(0).stop().slideUp(30);
      });

    // 우측 quick menu 따라다니기
    const handleScroll = () => {
      try {
        const elem = $("#quick_menu");
        const pos = $(window).scrollTop();
        if (pos === 0) {
          elem.stop().animate({ top: 100 }, 600);
        } else {
          elem.stop().animate({ top: pos + 100 }, 600);
        }
      } catch (ex) {
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
      {/* Quick menu (우측 따라다니기) */}
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
        <div
          className="top"
          onClick={() => window.scrollTo(0, 0)}
        >
          <img src="/img/common/top.gif" alt="top" />
        </div>
      </div>

      {/* 팝업 자리 (원본 pop_wrapper) */}
      <div
        id="pop_wrapper"
        style={{ width: "940px", height: "1px", position: "relative", zIndex: 9 }}
      />

      {/* 본 헤더 */}
      <div className="header">
        <div className="bt_top">
          <Link href="/">HOME</Link> | <Link href="/sitemap">SITEMAP</Link>
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
