import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { isBoardSlug } from '@/lib/boards';

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const board_slug = String(body?.board_slug ?? '');
    const title = String(body?.title ?? '').trim();
    const content = String(body?.content ?? '');
    const is_notice = !!body?.is_notice;
    const is_private = !!body?.is_private;

    if (!isBoardSlug(board_slug)) {
      return NextResponse.json({ ok: false, error: '게시판 값이 올바르지 않습니다.' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ ok: false, error: '제목을 입력해 주세요.' }, { status: 400 });
    }

    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from('posts')
      .insert({
        board_slug,
        title,
        content,
        is_admin_post: true,
        is_notice,
        is_private,
        author_name: '관리자',
      })
      .select('id')
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '저장 실패' },
      { status: 500 },
    );
  }
}
