import { NextResponse } from 'next/server';
import { getPost, toPublicDetail } from '@/lib/posts';
import { verifyPostPassword } from '@/lib/passwords';
import { getAdminSession } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ ok: false, error: '잘못된 게시글 ID' }, { status: 400 });
  }
  try {
    const found = await getPost(numId);
    if (!found) return NextResponse.json({ ok: false, error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    const session = await getAdminSession();
    const isAdmin = !!session;
    if (!found.post.is_private) {
      const detail = toPublicDetail(found.post, found.files, { unlocked: true, isAdmin });
      return NextResponse.json({ ok: true, post: detail });
    }
    const body = await req.json().catch(() => ({}));
    const password = String(body?.password ?? '');
    const ok = isAdmin || (await verifyPostPassword(password, found.post.author_password_hash));
    if (!ok) {
      return NextResponse.json({ ok: false, error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }
    const detail = toPublicDetail(found.post, found.files, { unlocked: true, isAdmin });
    return NextResponse.json({ ok: true, post: detail });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '오류' },
      { status: 500 },
    );
  }
}
