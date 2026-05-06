import { redirect } from 'next/navigation';
import AdminPostForm from '@/components/AdminPostForm';
import { getAdminSession } from '@/lib/auth';

export const metadata = { title: '새 글 작성' };
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ board?: string }>;
}

export default async function AdminNewPostPage({ searchParams }: PageProps) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const { board } = await searchParams;
  return (
    <div className="admin-shell">
      <div className="admin-shell__header">
        <h1>새 글 작성</h1>
      </div>
      <AdminPostForm mode="create" initial={{ board_slug: board }} />
    </div>
  );
}
