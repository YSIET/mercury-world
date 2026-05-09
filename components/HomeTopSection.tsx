"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type HomeRecentLink = { title: string; href: string };

export default function HomeTopSection({
  recentNotice,
  recentNews,
  recentPds,
}: {
  recentNotice: HomeRecentLink[];
  recentNews: HomeRecentLink[];
  recentPds: HomeRecentLink[];
}) {
  const [activeTab, setActiveTab] = useState<"notice" | "news" | "pds">("notice");

  useEffect(() => {
    const $ = (window as any).$ || (window as any).jQuery;
    if (!$) return;

    const bn_pause = 3000;
    let bn_speed = 1000;
    let bn_direction = 1;
    let bn_interval_id: ReturnType<typeof setInterval>;

    function banner_on() {
      const bn_width = $("#banner li").width();
      if (bn_direction === -1) {
        $("#banner")
          .prepend($("#banner li:last"))
          .css("left", "-" + bn_width + "px");
        $("#banner").stop().animate({ left: "0" }, bn_speed, function () {});
      } else {
        const $banner = $("#banner");
        $banner
          .stop()
          .animate({ left: "-" + bn_width + "px" }, bn_speed, function () {
            $banner.find("li").first().appendTo($banner);
            $banner.css("left", "0px");
          });
      }
    }

    bn_interval_id = setInterval(banner_on, bn_pause);
    $("#banner")
      .parent()
      .hover(
        function () {
          clearInterval(bn_interval_id);
        },
        function () {
          bn_speed = 1500;
          bn_interval_id = setInterval(banner_on, bn_pause);
        }
      );

    (window as any).banner_nav = (_dir: number) => {
      bn_direction = _dir;
    };

    return () => {
      clearInterval(bn_interval_id);
    };
  }, []);

  const listForTab =
    activeTab === "notice"
      ? recentNotice
      : activeTab === "news"
        ? recentNews
        : recentPds;

  return (
    <div id="Layer1">
      <div className="mw-fluid-rail mw-home-top-rail mw-banner-area">
        <div className="mw-mobile-scale-940-clip">
          <div className="mw-mobile-scale-940">
            <table
              className="mw-home-top-table"
              width={940}
              border={0}
              align="center"
              cellPadding={0}
              cellSpacing={0}
            >
        <tbody>
          <tr>
            <td width={609} valign="top">
              {/* 원본: 좌측 609px 비움 */}
            </td>
            <td height={112}>
              <div className="banner">
                <div className="main_title1">
                  <img
                    src="/img/img_new/main_title1.png"
                    alt="수은백서"
                    useMap="#main_title1"
                  />
                  <map name="main_title1">
                    <area
                      shape="rect"
                      coords="287,2,331,27"
                      href="/mercury/mercury"
                      alt="더보기"
                    />
                  </map>
                </div>
                <ul id="banner">
                  <li>
                    <Link href="/mercury/mercury">
                      <img
                        src="/flash/mercury/1.gif"
                        alt="수은이란"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/img/main/main_flash.gif";
                        }}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href="/mercury/mercury_cycle">
                      <img
                        src="/flash/mercury/2.gif"
                        alt="수은순환과생물농축"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/img/main/main_flash.gif";
                        }}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href="/mercury/fish">
                      <img
                        src="/flash/mercury/3.gif"
                        alt="어패류속수은"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/img/main/main_flash.gif";
                        }}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href="/mercury/emergency">
                      <img
                        src="/flash/mercury/4.gif"
                        alt="수은응급처리법"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/img/main/main_flash.gif";
                        }}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href="/mercury/regulation">
                      <img
                        src="/flash/mercury/5.gif"
                        alt="수은규제치"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/img/main/main_flash.gif";
                        }}
                      />
                    </Link>
                  </li>
                </ul>
                <span className="g_cursor nav_left" title="왼쪽">
                  ◀
                </span>
                <span className="g_cursor nav_right" title="오른쪽">
                  ▶
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td />
            <td style={{ paddingTop: 27 }}>
              <BoardTabsWidget
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                rows={listForTab}
              />
            </td>
          </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardTabsWidget({
  activeTab,
  setActiveTab,
  rows,
}: {
  activeTab: "notice" | "news" | "pds";
  setActiveTab: (t: "notice" | "news" | "pds") => void;
  rows: HomeRecentLink[];
}) {
  const tabImg = (key: "notice" | "news" | "pds") => {
    return {
      notice:
        activeTab === "notice" ? "/img/main/news3_ov.gif" : "/img/main/news3.gif",
      news:
        activeTab === "news" ? "/img/main/news1_ov.gif" : "/img/main/news1.gif",
      pds:
        activeTab === "pds" ? "/img/main/news2_ov.gif" : "/img/main/news2.gif",
    }[key];
  };

  const tabHref = (key: "notice" | "news" | "pds") => {
    return {
      notice: "/news/board",
      news: "/news/news",
      pds: "/news/pds",
    }[key];
  };

  return (
    <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
      <tbody>
        <tr>
          <td>
            <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td width={3} height={22} />
                  <td width={94} rowSpan={2}>
                    <Link href={tabHref("notice")}>
                      <img
                        src={tabImg("notice")}
                        alt="공지사항"
                        onMouseOver={() => setActiveTab("notice")}
                        style={{ cursor: "pointer" }}
                      />
                    </Link>
                  </td>
                  <td width={94} rowSpan={2}>
                    <img
                      src={tabImg("news")}
                      alt="수은관련뉴스"
                      onMouseOver={() => setActiveTab("news")}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td width={94} rowSpan={2}>
                    <img
                      src={tabImg("pds")}
                      alt="수은함유량"
                      onMouseOver={() => setActiveTab("pds")}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td width={46} colSpan={2} align="right">
                    <Link href={tabHref(activeTab)}>
                      <img src="/img/main/more.gif" alt="more" />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td height={1} bgcolor="#E3E3E3" />
                  <td colSpan={2} bgcolor="#E3E3E3" />
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table cellSpacing={0} cellPadding={0} width="100%" border={0}>
              <tbody>
                <tr>
                  <td height={7} />
                </tr>
                {rows.map((row, i) => (
                  <tr key={`${row.href}-${i}`}>
                    <td height={18} className="main_list">
                      <a href={row.href} style={{ color: "#444" }}>
                        {row.title.length > 32
                          ? row.title.slice(0, 32) + "..."
                          : row.title}
                      </a>
                    </td>
                  </tr>
                ))}
                {rows.length < 4 &&
                  Array.from({ length: 4 - rows.length }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td height={18} className="main_list">
                        &nbsp;
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
