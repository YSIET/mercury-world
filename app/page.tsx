"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * 원본 main.php 미러
 * - 우상단: 331x119 배너 슬라이더 (수은백서 5종 자동 슬라이드)
 * - 좌상단: 게시판 3탭 위젯 (공지사항/수은관련뉴스/수은함유량) — DB 이관 전 자리표시자
 * - 중앙: 940 폭 main_visual.gif (970x514, image map)
 */
export default function HomePage() {
  // 원본 MM_showHideLayers 동작: 게시판 탭 전환
  const [activeTab, setActiveTab] = useState<"notice" | "news" | "pds">(
    "notice"
  );

  return (
    <>
      <Header activeGroup={null} activePath="/" />

      {/* 원본 #Layer1: 메인 상단 영역 — 좌측 게시판 위젯 + 우측 배너 */}
      <div id="Layer1">
        <table
          width={940}
          border={0}
          align="center"
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            <tr>
              <td width={609} valign="top">
                {/* 게시판 위젯 자리 — 좌측 609px */}
              </td>
              <td height={112}>
                {/* 우상단 331x119 배너 */}
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
                  {/* 원본 배너 슬라이드 이미지(/flash/mercury/1~5.gif)는 카페24 백업의
                      flash 디렉토리에 있으나 슬림 번들에는 미포함.
                      추후 전체 백업에서 추출 후 /public/flash/mercury/ 에 추가하면 자동 적용. */}
                  <ul id="banner">
                    <li>
                      <Link href="/mercury/mercury">
                        <img src="/flash/mercury/1.gif" alt="수은이란" onError={(e) => { (e.target as HTMLImageElement).src = "/img/main/main_flash.gif"; }} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/mercury/mercury_cycle">
                        <img src="/flash/mercury/2.gif" alt="수은순환과생물농축" onError={(e) => { (e.target as HTMLImageElement).src = "/img/main/main_flash.gif"; }} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/mercury/fish">
                        <img src="/flash/mercury/3.gif" alt="어패류속수은" onError={(e) => { (e.target as HTMLImageElement).src = "/img/main/main_flash.gif"; }} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/mercury/emergency">
                        <img src="/flash/mercury/4.gif" alt="수은응급처리법" onError={(e) => { (e.target as HTMLImageElement).src = "/img/main/main_flash.gif"; }} />
                      </Link>
                    </li>
                    <li>
                      <Link href="/mercury/regulation">
                        <img src="/flash/mercury/5.gif" alt="수은규제치" onError={(e) => { (e.target as HTMLImageElement).src = "/img/main/main_flash.gif"; }} />
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
                {/* 게시판 3탭 위젯 — 원본 markup 보존 */}
                <BoardTabsWidget activeTab={activeTab} setActiveTab={setActiveTab} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 메인 비주얼 (970x514) + image map */}
      <table width={940} border={0} cellPadding={0} cellSpacing={0} style={{ margin: "0 auto" }}>
        <tbody>
          <tr>
            <td height={26}>&nbsp;</td>
          </tr>
          <tr>
            <td style={{ paddingTop: 20 }}>
              <img
                src="/img/img_new/main_visual.gif"
                alt="메인 이미지"
                style={{ width: 970, height: 514 }}
                useMap="#Map"
              />
              <map name="Map">
                <area
                  shape="rect"
                  coords="663,268,810,409"
                  href="/community/request"
                  alt="분석의뢰"
                />
                <area
                  shape="rect"
                  coords="830,269,940,414"
                  href="/content/content"
                  alt="수은IQ테스트"
                />
              </map>
            </td>
          </tr>
        </tbody>
      </table>

      <Footer />
    </>
  );
}

/**
 * 원본 #notice03/#notice04/#notice10 3탭 게시판 위젯
 * DB 이관 전 자리표시자
 */
function BoardTabsWidget({
  activeTab,
  setActiveTab,
}: {
  activeTab: "notice" | "news" | "pds";
  setActiveTab: (t: "notice" | "news" | "pds") => void;
}) {
  const tabImg = (key: "notice" | "news" | "pds") => {
    // 원본: news3=공지사항(notice), news1=수은관련뉴스(news), news2=수은함유량(pds)
    return {
      notice: activeTab === "notice" ? "/img/main/news3_ov.gif" : "/img/main/news3.gif",
      news: activeTab === "news" ? "/img/main/news1_ov.gif" : "/img/main/news1.gif",
      pds: activeTab === "pds" ? "/img/main/news2_ov.gif" : "/img/main/news2.gif",
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
                {/* DB 이관 전 자리표시자 — 4행 */}
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td height={18} className="main_list">
                      <span style={{ color: "#bbbbbb" }}>
                        — 게시판 데이터 이관 후 표시 —
                      </span>
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
