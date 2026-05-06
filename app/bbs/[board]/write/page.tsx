import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import SubNav from '@/components/SubNav';
import BoardWriteForm from '@/components/BoardWriteForm';
import { BOARDS, BOARD_SLUGS, getBoard } from '@/lib/boards';

interface PageProps {
  params: Promise<{ board: string }>;
}

const SUB_NAV_ITEMS = BOARD_SLUGS.map((slug) => ({
  label: BOARDS[slug].title,
  href: `/bbs/${slug}`,
}));

export async function generateMetadata({ params }: PageProps) {
  const { board } = await params;
  const meta = getBoard(board);
  return { title: meta ? `${meta.title} 글쓰기` : '글쓰기' };
}

export default async function BoardWritePage({ params }: PageProps) {
  const { board } = await params;
  const meta = getBoard(board);
  if (!meta) notFound();
  if (!meta.allowsUserWrite) {
    return (
      <>
        <PageHeader
          title={meta.title}
          subtitle="이 게시판은 관리자만 글을 작성할 수 있습니다."
          breadcrumbs={[{ label: '게시판', href: '/bbs/notice' }, { label: meta.title }]}
        />
        <div className="container" style={{ paddingBottom: 64 }}>
          <div className="alert alert--error">
            본 게시판({meta.title})은 사용자 글쓰기가 허용되지 않습니다.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`${meta.title} 글쓰기`}
        subtitle={meta.description}
        breadcrumbs={[
          { label: '게시판', href: '/bbs/notice' },
          { label: meta.title, href: `/bbs/${meta.slug}` },
          { label: '글쓰기' },
        ]}
      />
      <div className="container">
        <div className="page-grid">
          <SubNav title="게시판" items={SUB_NAV_ITEMS} />
          <section>
            <BoardWriteForm board={meta.slug} boardTitle={meta.title} />
          </section>
        </div>
      </div>
    </>
  );
}
