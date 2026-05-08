import SubPageLayout from "@/components/SubPageLayout";
import BoardListClient from "@/components/BoardListClient";
import { isAdminFromCookies } from "@/lib/admin-auth-server";
import {
  BOARD_TITLE_IMG,
  boardSectionHeading,
} from "@/lib/board";
import type { Metadata } from "next";

const BOARD: "notice" = "notice";

export const metadata: Metadata = {
  title: boardSectionHeading(BOARD),
};

export default async function Page() {
  const isAdmin = await isAdminFromCookies();
  const heading = boardSectionHeading(BOARD);

  return (
    <SubPageLayout
      activeGroup={1300}
      sideGroup={1300}
      activePath="/news/board"
      leftCategory="news"
      heroImg="/img/news/img.gif"
      titleImg={BOARD_TITLE_IMG[BOARD]}
      breadcrumb={<>HOME &gt; 수은소식 &gt; {heading}</>}
    >
      <h1
        style={{
          fontSize: 18,
          fontWeight: 600,
          margin: "4px 0 12px",
          lineHeight: 1.35,
        }}
      >
        {heading}
      </h1>
      <BoardListClient boardType="notice" isAdmin={isAdmin} />
    </SubPageLayout>
  );
}
