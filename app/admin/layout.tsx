import Link from 'next/link';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'var(--color-primary-dark)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          marginBottom: 24,
        }}
      >
        <strong style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>관리자</span>
          {session && (
            <Link href="/admin/posts" style={{ color: '#fff', fontWeight: 500 }}>
              게시글 관리
            </Link>
          )}
        </strong>
        {session ? (
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="btn">
              로그아웃 ({session.email})
            </button>
          </form>
        ) : (
          <Link href="/admin/login" className="btn">
            로그인
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
