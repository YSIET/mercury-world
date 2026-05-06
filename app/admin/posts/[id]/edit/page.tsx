import { notFound, redirect } from 'next/navigation';
import AdminPostForm from '@/components/AdminPostForm';
import { getAdminSession } from '@/lib/auth';
import { getPost } from '@/lib/posts';

export const metadata = { title: '글 수정' };
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPostPage({ params }: PageProps) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const { id } = await params;
  const found = await getPost(Number(id));
  if (!found) notFound();
  const { post } = found;
  return (
    <div className="admin-shell">
      <div className="admin-shell__header">
        <h1>글 수정 — #{post.id}</h1>
      </div>
      <AdminPostForm
        mode="edit"
        initial={{
          id: post.id,
          board_slug: post.board_slug,
          title: post.title,
          content: post.content,
          is_notice: post.is_notice,
          is_private: post.is_private,
        }}
      />
    </div>
  );
}
