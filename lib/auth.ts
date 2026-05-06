import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { timingSafeEqual } from './passwords';

const COOKIE_NAME = 'mw_admin';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8h

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'ADMIN_SESSION_SECRET 환경변수를 16자 이상으로 설정해야 합니다.',
    );
  }
  return new TextEncoder().encode(secret);
}

interface AdminPayload {
  email: string;
  iat: number;
}

export interface AdminSession {
  email: string;
}

export async function checkAdminCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) {
    throw new Error(
      'ADMIN_EMAIL / ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.',
    );
  }
  return (
    timingSafeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase()) &&
    timingSafeEqual(password, expectedPassword)
  );
}

export async function createAdminSession(email: string): Promise<void> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const { email } = payload as unknown as AdminPayload;
    if (!email) return null;
    return { email };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new AdminAuthError();
  }
  return session;
}

export class AdminAuthError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'AdminAuthError';
  }
}
