import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { isBoardSlug } from '@/lib/boards';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ ok: false, error: '잘못된 게시글 ID' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const update: Record<string, unknown> = {
      title: String(body?.title ?? '').trim(),
      content: String(body?.content ?? ''),
      is_notice: !!body?.is_notice,
      is_private: !!body?.is_private,
      updated_at: new Date().toISOString(),
    };
    const board_slug = body?.board_slug;
    if (typeof board_slug === 'string' && isBoardSlug(board_slug)) {
      update.board_slug = board_slug;
    }
    if (!update.title) {
      return NextResponse.json({ ok: false, error: '제목은 필수입니다.' }, { status: 400 });
    }
    const sb = getAdminSupabase();
    const { error } = await sb.from('posts').update(update).eq('id', numId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '수정 실패' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ ok: false, error: '잘못된 게시글 ID' }, { status: 400 });
  }
  try {
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
