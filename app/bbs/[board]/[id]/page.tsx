import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import SubNav from '@/components/SubNav';
import PostDetailView from '@/components/PostDetailView';
import { BOARDS, BOARD_SLUGS, getBoard } from '@/lib/boards';
import { getAdminSession } from '@/lib/auth';
import { getPost, incrementViews, toPublicDetail } from '@/lib/posts';

interface PageProps {
  params: Promise<{ board: string; id: string }>;
}

const SUB_NAV_ITEMS = BOARD_SLUGS.map((slug) => ({
  label: BOARDS[slug].title,
  href: `/bbs/${slug}`,
}));

export async function generateMetadata({ params }: PageProps) {
  const { board, id } = await params;
  const meta = getBoard(board);
  if (!meta) return { title: '게시글' };
  try {
    const found = await getPost(Number(id));
    if (!found) return { title: '게시글 없음' };
    if (found.post.is_private) return { title: `[비공개] - ${meta.title}` };
    return { title: `${found.post.title} - ${meta.title}` };
  } catch {
    return { title: meta.title };
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { board, id } = await params;
  const meta = getBoard(board);
  if (!meta) notFound();
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const found = await getPost(numId);
  if (!found || found.post.board_slug !== meta.slug) notFound();

  // increment views (best-effort)
  void incrementViews(numId);

  const session = await getAdminSession();
  const isAdmin = !!session;
  const isPrivateLocked = found.post.is_private && !isAdmin;

  const detail = toPublicDetail(found.post, found.files, {
    unlocked: false,
    isAdmin,
  });

  return (
    <>
      <PageHeader
        title={meta.title}
        subtitle={meta.description}
        breadcrumbs={[
          { label: '게시판', href: '/bbs/notice' },
          { label: meta.title, href: `/bbs/${meta.slug}` },
          { label: '게시글 보기' },
        ]}
      />
      <div className="container">
        <div className="page-grid">
          <SubNav title="게시판" items={SUB_NAV_ITEMS} />
          <section>
            <PostDetailView
              post={detail}
              boardBasePath={`/bbs/${meta.slug}`}
              isAdmin={isAdmin}
              isPrivateLocked={isPrivateLocked}
              allowsUserWrite={meta.allowsUserWrite}
            />
          </section>
        </div>
      </div>
    </>
  );
}
