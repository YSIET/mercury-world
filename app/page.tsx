import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeTopSection from "@/components/HomeTopSection";
import { getRecentPosts } from "@/lib/posts";

/**
 * 원본 main.php 미러
 * - 우상단: 331x119 배너 슬라이더
 * - 우하단 탭: 공지사항/수은관련뉴스/수은함유량 (JSON)
 * - 중앙: 940 폭 main_visual.gif (970x514, image map)
 */
export default function HomePage() {
  const recentNotice = getRecentPosts("notice", 4);
  const recentNews = getRecentPosts("news", 4);
  const recentPds = getRecentPosts("pds", 4);

  return (
    <>
      <Header activeGroup={null} activePath="/" />

      <HomeTopSection
        recentNotice={recentNotice}
        recentNews={recentNews}
        recentPds={recentPds}
      />

      {/* 메인 비주얼 (970x514) + image map */}
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
                  href="/test/q"
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
