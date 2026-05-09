import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeTopSection from "@/components/HomeTopSection";
import MainVisualWithIqHotspot from "@/components/MainVisualWithIqHotspot";
import { getRecentBoardLinks } from "@/lib/board";

/**
 * 원본 main.php 미러
 * - 우상단: 331x119 배너 슬라이더
 * - 우하단 탭: 공지사항/수은관련뉴스/수은함유량 (KV)
 * - 중앙: 940 폭 main_visual.gif (970x514, image map)
 */
export default async function HomePage() {
  const [recentNotice, recentNews, recentPds] = await Promise.all([
    getRecentBoardLinks("notice", 4),
    getRecentBoardLinks("news", 4),
    getRecentBoardLinks("pds", 4),
  ]);

  return (
    <>
      <Header activeGroup={null} activePath="/" />

      <HomeTopSection
        recentNotice={recentNotice}
        recentNews={recentNews}
        recentPds={recentPds}
      />

      <div className="mw-fluid-rail mw-main-visual-section">
        <table
          width={940}
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ margin: "0 auto" }}
        >
          <tbody>
            <tr>
              <td height={26}>&nbsp;</td>
            </tr>
            <tr>
              <td style={{ paddingTop: 20 }}>
                <MainVisualWithIqHotspot />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
}
