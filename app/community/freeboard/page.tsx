import SubPageLayout from "@/components/SubPageLayout";
import { listPathForSlug } from "@/lib/post-utils";
import FreeboardListMerged from "./FreeboardListMerged";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "묻고답하기",
};

export default function Page() {
  const slug = "freeboard";
  const listBase = listPathForSlug(slug);

  return (
    <SubPageLayout
      activeGroup={1400}
      sideGroup={1400}
      activePath="/community/freeboard"
      leftCategory="community"
      heroImg="/img/community/img.gif"
      titleImg="/img/community/title_1.gif"
      breadcrumb={<>HOME &gt; 수은상담소 &gt; 묻고답하기</>}
    >
      <table width="100%" height={20} border={0} cellSpacing={0} cellPadding={0}>
        <tbody>
          <tr>
            <td valign="top" style={{ paddingBottom: 5 }}>
              <img src="/img/community/text_1.gif" alt="" />
            </td>
          </tr>
        </tbody>
      </table>
      <FreeboardListMerged listBase={listBase} />
    </SubPageLayout>
  );
}
