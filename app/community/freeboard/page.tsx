import SubPageLayout from "@/components/SubPageLayout";
import { getPostsByBoard, formatDate, listPathForSlug } from "@/lib/posts";

export default function Page() {
  const slug = "freeboard";
  const posts = getPostsByBoard(slug);
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
      <table
        width="100%"
        border={0}
        cellPadding={0}
        cellSpacing={1}
        style={{ background: "#cccccc", marginTop: 10 }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th height={30} width={60}>
              번호
            </th>
            <th>제목</th>
            <th width={100}>작성자</th>
            <th width={80}>작성일</th>
            <th width={60}>조회</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr style={{ background: "white" }}>
              <td colSpan={5} align="center" height={60}>
                등록된 글이 없습니다.
              </td>
            </tr>
          ) : (
            posts.map((post, i) => (
              <tr key={post.id} style={{ background: "white" }}>
                <td align="center" height={28}>
                  {post.is_notice ? "공지" : posts.length - i}
                </td>
                <td style={{ paddingLeft: 8 }}>
                  <a href={`${listBase}/${post.legacy_bd_no}`} style={{ color: "#444" }}>
                    {post.title}
                  </a>
                </td>
                <td align="center">{post.author_name}</td>
                <td align="center">{formatDate(post.created_at)}</td>
                <td align="center">{post.hit_count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SubPageLayout>
  );
}
