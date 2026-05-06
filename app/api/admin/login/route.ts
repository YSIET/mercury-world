import { NextResponse } from 'next/server';
import { checkAdminCredentials, createAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim();
    const password = String(body?.password ?? '');
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: '이메일과 비밀번호를 입력해 주세요.' }, { status: 400 });
    }
    const ok = await checkAdminCredentials(email, password);
    if (!ok) {
      return NextResponse.json({ ok: false, error: '이메일 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }
    await createAdminSession(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '로그인 처리 중 오류' },
      { status: 500 },
    );
  }
}
