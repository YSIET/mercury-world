import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm';
import { getAdminSession } from '@/lib/auth';

export const metadata = { title: '관리자 로그인' };
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect('/admin/posts');
  return (
    <div className="admin-shell">
      <div className="admin-shell__header">
        <h1>관리자 로그인</h1>
      </div>
      <AdminLoginForm />
    </div>
  );
}
