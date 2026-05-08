import SubPageLayout from "@/components/SubPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "수은응급처리키트(YSMK101)",
};

const bodyStyle = {
  fontFamily: "굴림, Gulim, sans-serif",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#444",
} as const;

const STORE_URL = "https://storefarm.naver.com/ysiet";

export default function Page() {
  return (
    <SubPageLayout
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/kit"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_3.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 수은응급처리키트</>}
    >
      <div style={{ ...bodyStyle, width: 700, maxWidth: "100%" }}>
        <table
          width={700}
          border={0}
          cellSpacing={0}
          cellPadding={0}
          style={{ marginBottom: 20 }}
        >
          <colgroup>
            <col style={{ width: 340 }} />
            <col style={{ width: 20 }} />
            <col style={{ width: 340 }} />
          </colgroup>
          <tbody>
            <tr>
              <td valign="top">
                <img src="/img/community/kit_img01.gif" alt="" />
              </td>
              <td />
              <td valign="top">
                <div
                  style={{
                    width: 340,
                    height: 240,
                    boxSizing: "border-box",
                    border: "1px solid #cccccc",
                    background: "#f9f9f9",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    textAlign: "center",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  <p style={{ margin: "0 0 12px" }}>
                    동영상은 네이버 스토어에서
                    <br />
                    확인하실 수 있습니다.
                  </p>
                  <a
                    href={STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bd1", fontWeight: "bold" }}
                  >
                    네이버 스토어 바로가기
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table width={700} border={0} cellSpacing={0} cellPadding={0}>
          <tbody>
            <tr>
              <td
                style={{
                  border: "solid 5px #eeeeee",
                  padding: 10,
                  ...bodyStyle,
                }}
              >
                수은응급처리키트는 금속수은 유출 시 안전하고 신속하게 대응하여 처리
                할 수 있는 예방 비치용 키트입니다. 수은응급처리키트는 수은이 유출된
                표면으로부터 수은을 안전하게 제거 할 수 있는 수은 흡착제를 비롯하여
                잔여수은의 존재 여부 확인용 지시약, 수은폐기물 저장 밀폐 용기, 보호
                장갑과 수은방독마스크 등의 보호 장구로 구성됩니다.
                수은응급처리키트를 이용하여 유출된 수은을 처리하였을 경우 금속
                수은으로부터 발생하는 수은 증기의 배출을 억제하여 체내로 흡입 되는
                수은의 양을 최소화 할 수 있습니다. 따라서 각 가정이나 병원 및
                공공기관 등에서는 수은응급처리키트를 미리 비치해 두시고 수은이
                유출되는 응급상황이 발생하였을 때 사용하시기 바랍니다.
                <br />
                <br />
                수은응급처리키트(YSMK101)는 아래 그림과 같이 구성되어 있으며 총 2회
                사용을 기준으로 하고 있습니다. 사용한 모든 소모품 및 폐기물은 적절한
                절차에 따른 폐기를 원칙으로 하고 있고, 소모품은 리필용 세트로도
                구매가 가능하오니 참고하시기 바랍니다.
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: 20, paddingBottom: 3 }}>
                <img
                  src="/img/common/icon_b8.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />{" "}
                <img
                  src="/img/community/kit_label01.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />
              </td>
            </tr>
            <tr>
              <td style={bodyStyle}>
                수은응급처리키트 상자 (1개), 수은회수통 (2통), 수은흡착제 (2통),
                활성액 (2통), 수은지시약 (2통), 스펀지 (2개), 수은폐기물 폐기봉투
                (2장), 보호 장갑 및 흡착지 (2세트), 보안경 (1개), 손전등 (1개),
                수은방독마스크 (선택사항)
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: 20, paddingBottom: 3 }}>
                <img
                  src="/img/common/icon_b8.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />{" "}
                <img
                  src="/img/community/kit_label02.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />
              </td>
            </tr>
            <tr>
              <td style={bodyStyle}>
                (주)YS환경기술연구원 (Tel. 02-312-0540)
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: 20, paddingBottom: 3 }}>
                <img
                  src="/img/common/icon_b8.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />{" "}
                <img
                  src="/img/community/kit_label03.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <table
                  border={0}
                  cellSpacing={0}
                  cellPadding={0}
                  style={{ marginLeft: 10 }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <a
                          href="http://www.kbsmc.co.kr/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/samsung_link.gif" alt="" />
                        </a>
                      </td>
                      <td>
                        <a
                          href="http://www.eumc.co.kr/mokdong/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/idmd_link.gif" alt="" />
                        </a>
                      </td>
                      <td>
                        <a
                          href="http://www.caumc.or.kr/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/csu_link.gif" alt="" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          href="http://www.khnmc.or.kr/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/khu_link.gif" alt="" />
                        </a>
                      </td>
                      <td>
                        <a
                          href="http://snu.ac.kr/index.html"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/link_snu.png" alt="" />
                        </a>
                      </td>
                      <td>
                        <a
                          href="http://www.schmc.ac.kr/bucheon/kor/index.do"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/link_schmc.png" alt="" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          href="http://yonsei.ac.kr/sc/index.jsp"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/link_yonsei.png" alt="" />
                        </a>
                      </td>
                      <td>
                        <a
                          href="http://www.ewha.ac.kr/mbs/ewhakr/index.jsp"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/link_ewha.png" alt="" />
                        </a>
                      </td>
                      <td>
                        <a
                          href="http://kangdong.hallym.or.kr/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="/img/community/link_hallym.png" alt="" />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ paddingTop: 20, paddingBottom: 3 }}>
                <img
                  src="/img/common/icon_b8.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />{" "}
                <img
                  src="/img/community/kit_label04.gif"
                  alt=""
                  style={{ verticalAlign: "middle" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: 20 }}>
                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="온라인 구매 바로가기"
                  style={{ fontSize: 14 }}
                >
                  <img src="/img/community/kit_online.gif" alt="온라인 구매" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SubPageLayout>
  );
}
