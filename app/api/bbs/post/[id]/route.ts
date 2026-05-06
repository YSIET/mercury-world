import { NextResponse } from 'next/server';
import { getPost } from '@/lib/posts';
import { verifyPostPassword } from '@/lib/passwords';
import { getAdminSession } from '@/lib/auth';
import { getAdminSupabase } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ ok: false, error: '잘못된 게시글 ID' }, { status: 400 });
  }
  try {
    const found = await getPost(numId);
    if (!found) {
      return NextResponse.json({ ok: false, error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }
    const session = await getAdminSession();
    const isAdmin = !!session;

    if (!isAdmin) {
      if (found.post.is_admin_post) {
        return NextResponse.json({ ok: false, error: '관리자 글은 삭제할 수 없습니다.' }, { status: 403 });
      }
      const body = await req.json().catch(() => ({}));
      const password = String(body?.password ?? '');
      const ok = await verifyPostPassword(password, found.post.author_password_hash);
      if (!ok) {
        return NextResponse.json({ ok: false, error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
      }
    }
    const sb = getAdminSupabase();
    const { error } = await sb.from('posts').delete().eq('id', numId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '삭제 실패' },
      { status: 500 },
    );
  }
}
