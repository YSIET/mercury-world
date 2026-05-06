import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { isBoardSlug, BOARDS } from '@/lib/boards';
import { hashPostPassword } from '@/lib/passwords';

interface RouteParams {
  params: Promise<{ board: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const { board } = await params;
  if (!isBoardSlug(board)) {
    return NextResponse.json({ ok: false, error: '존재하지 않는 게시판입니다.' }, { status: 404 });
  }
  if (!BOARDS[board].allowsUserWrite) {
    return NextResponse.json({ ok: false, error: '이 게시판은 사용자 글쓰기가 허용되지 않습니다.' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const title = String(body?.title ?? '').trim();
    const content = String(body?.content ?? '');
    const author_name = String(body?.author_name ?? '').trim();
    const password = String(body?.password ?? '');
    const is_private = !!body?.is_private;

    if (!title) return NextResponse.json({ ok: false, error: '제목을 입력해 주세요.' }, { status: 400 });
    if (!content.trim()) return NextResponse.json({ ok: false, error: '내용을 입력해 주세요.' }, { status: 400 });
    if (!author_name) return NextResponse.json({ ok: false, error: '작성자명을 입력해 주세요.' }, { status: 400 });
    if (password.length < 4) {
      return NextResponse.json({ ok: false, error: '비밀번호는 4자 이상이어야 합니다.' }, { status: 400 });
    }

    const password_hash = await hashPostPassword(password);
    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from('posts')
      .insert({
        board_slug: board,
        title,
        content,
        author_name,
        author_password_hash: password_hash,
        is_admin_post: false,
        is_notice: false,
        is_private,
      })
      .select('id')
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '글 등록 실패' },
      { status: 500 },
    );
  }
}
