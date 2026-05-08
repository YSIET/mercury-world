import Header, { SideNav } from "./Header";
import Footer from "./Footer";

interface SubPageLayoutProps {
  /** 상단 메뉴 active 그룹 (1100/1200/1300/1400/1500) */
  activeGroup: number | null;
  /** 좌측 사이드 메뉴 그룹 (없으면 표시 안 함, greeting 페이지 등) */
  sideGroup: number | null;
  /** 현재 페이지 경로 (active 표시용) */
  activePath: string;
  /** 좌측 카테고리 — left_top.gif/left_bg.gif/left_bottom.gif가 들어있는 폴더명 (site/mercury/news/community/content) */
  leftCategory: string;
  /** 본문 비주얼 이미지 경로 (각 카테고리의 img.gif) */
  heroImg: string;
  /** 본문 좌측 제목 이미지 (title_1.gif 등) */
  titleImg: string;
  /** breadcrumb (HOME > 수은백서 > 수은이란 같은 텍스트) */
  breadcrumb: React.ReactNode;
  /** 본문 콘텐츠 영역 */
  children: React.ReactNode;
}

export default function SubPageLayout({
  activeGroup,
  sideGroup,
  activePath,
  leftCategory,
  heroImg,
  titleImg,
  breadcrumb,
  children,
}: SubPageLayoutProps) {
  return (
    <>
      <Header activeGroup={activeGroup} activePath={activePath} />

      <div className="mw-fluid-rail mw-subpage-rail">
        <table border={0} cellSpacing={0} cellPadding={0} style={{ margin: "0 auto" }}>
        <tbody>
          <tr>
            {/* 좌측 213 */}
            <td width={213} valign="top">
              <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr>
                    <td>
                      <img
                        src={`/img/${leftCategory}/left_top.gif`}
                        width={213}
                        alt=""
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        backgroundImage: `url(/img/${leftCategory}/left_bg.gif)`,
                        paddingLeft: 18,
                      }}
                    >
                      {sideGroup !== null && (
                        <SideNav group={sideGroup} activePath={activePath} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src={`/img/${leftCategory}/left_bottom.gif`}
                        width={213}
                        alt=""
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* 본문 727 */}
            <td width={727} valign="top">
              <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <img src={heroImg} alt="" />
                    </td>
                  </tr>
                  <tr>
                    <td width="17%" valign="bottom">
                      <img src={titleImg} alt="" />
                    </td>
                    <td
                      width="83%"
                      align="right"
                      valign="bottom"
                      className="here"
                      style={{ paddingBottom: 3 }}
                    >
                      {breadcrumb}
                    </td>
                  </tr>
                  <tr>
                    <td
                      height={3}
                      style={{
                        backgroundImage: `url(/img/${leftCategory}/title_line_1.gif)`,
                      }}
                    />
                    <td
                      height={3}
                      style={{
                        backgroundImage: `url(/img/${leftCategory}/title_line_2.gif)`,
                      }}
                    />
                  </tr>
                  <tr>
                    <td height={27} colSpan={2} />
                  </tr>
                </tbody>
              </table>

              {/* 페이지별 본문 */}
              <div style={{ width: 727, textAlign: "left" }} className="mw-prose">
                {children}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <table width={100} height={30} border={0} cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <Footer />
    </>
  );
}
