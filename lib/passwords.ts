import bcrypt from 'bcryptjs';

const POST_PW_ROUNDS = 10;

export async function hashPostPassword(plain: string): Promise<string> {
  if (!plain || plain.length < 4) {
    throw new Error('비밀번호는 최소 4자 이상이어야 합니다.');
  }
  return bcrypt.hash(plain, POST_PW_ROUNDS);
}

export async function verifyPostPassword(
  plain: string,
  hash: string | null,
): Promise<boolean> {
  if (!hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/**
 * Constant-time string compare for the admin password (which lives in env).
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
