import SubPageLayout from "@/components/SubPageLayout";
import BoardListClient from "@/components/BoardListClient";
import { isAdminFromCookies } from "@/lib/admin-auth-server";

export default async function Page() {
  const isAdmin = await isAdminFromCookies();

  return (
    <SubPageLayout
      activeGroup={1300}
      sideGroup={1300}
      activePath="/news/pds"
      leftCategory="news"
      heroImg="/img/news/img.gif"
      titleImg="/img/news/title_3.gif"
      breadcrumb={<>HOME &gt; 수은소식 &gt; 수은함유량정보</>}
    >
      <BoardListClient boardType="pds" isAdmin={isAdmin} />
    </SubPageLayout>
  );
}
