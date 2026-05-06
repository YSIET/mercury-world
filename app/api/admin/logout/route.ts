import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  await destroyAdminSession();
  // Form submission posts here — redirect back to /admin/login.
  const url = new URL('/admin/login', req.url);
  return NextResponse.redirect(url, { status: 303 });
}

export async function GET(req: Request) {
  await destroyAdminSession();
  const url = new URL('/admin/login', req.url);
  return NextResponse.redirect(url, { status: 303 });
}
