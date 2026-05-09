"use client";

import HeaderClient, { SideNav } from "@/components/HeaderClient";
import AdminHeaderTopLinksClient from "@/components/AdminHeaderTopLinksClient";
import Footer from "@/components/Footer";
import MobileBackButton from "@/components/MobileBackButton";

interface SubPageLayoutClientProps {
  activeGroup: number | null;
  sideGroup: number | null;
  activePath: string;
  leftCategory: string;
  heroImg: string;
  titleImg: string;
  breadcrumb: React.ReactNode;
  children: React.ReactNode;
}

/** Client pages that cannot import server `Header` / `SubPageLayout`. */
export default function SubPageLayoutClient({
  activeGroup,
  sideGroup,
  activePath,
  leftCategory,
  heroImg,
  titleImg,
  breadcrumb,
  children,
}: SubPageLayoutClientProps) {
  return (
    <>
      <HeaderClient
        activeGroup={activeGroup}
        activePath={activePath}
        adminTopLinks={<AdminHeaderTopLinksClient />}
      />

      <div className="mw-fluid-rail mw-subpage-rail">
        <table border={0} cellSpacing={0} cellPadding={0} style={{ margin: "0 auto" }}>
        <tbody>
          <tr>
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

            <td width={727} valign="top">
              <MobileBackButton />
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
