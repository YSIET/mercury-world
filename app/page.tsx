import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeTopSection from "@/components/HomeTopSection";
import MainVisualWithIqHotspot from "@/components/MainVisualWithIqHotspot";
import MobileHome from "@/components/MobileHome";
import { getRecentBoardLinks } from "@/lib/board";

/**
 * 원본 main.php 미러 (데스크탑) + 모바일 modern 전용 홈 (Sprint 29)
 */
export default async function HomePage() {
  const [recentNotice, recentNews, recentPds] = await Promise.all([
    getRecentBoardLinks("notice", 4),
    getRecentBoardLinks("news", 4),
    getRecentBoardLinks("pds", 4),
  ]);

  return (
    <div className="mw-home-page">
      <Header activeGroup={null} activePath="/" />

      <main className="mw-home-main">
        <div className="mw-desktop-home">
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
        </div>

        <div className="mw-mobile-home-wrap">
          <MobileHome />
        </div>
      </main>

      <Footer />
    </div>
  );
}
