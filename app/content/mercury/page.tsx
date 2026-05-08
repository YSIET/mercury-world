import SubPageLayout from "@/components/SubPageLayout";
import MercuryContentTable from "@/components/MercuryContentTable";
import { isAdminFromCookies } from "@/lib/admin-auth-server";
import {
  ensureMercuryPlaceholderRows,
  listMercuryRows,
} from "@/lib/mercury-content";

export const dynamic = "force-dynamic";

export default async function MercuryContentPage() {
  await ensureMercuryPlaceholderRows();
  const rows = await listMercuryRows();
  const showEdit = await isAdminFromCookies();

  return (
    <SubPageLayout
      activeGroup={1500}
      sideGroup={1500}
      activePath="/content/mercury"
      leftCategory="content"
      heroImg="/img/content/img.gif"
      titleImg="/img/content/title_3.gif"
      breadcrumb={<>HOME &gt; 식품속수은 &gt; 수은함유량 데이터</>}
    >
      <MercuryContentTable initialRows={rows} showEditLink={showEdit} />
    </SubPageLayout>
  );
}
