// Signed session tokens. Edge-runtime safe (used from middleware).
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'mlc_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export function sessionConfigured(): boolean {
  return secretKey() !== null && Boolean(process.env.ADMIN_PASSWORD);
}

export async function createSessionToken(): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error('SESSION_SECRET is not configured');
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  const key = secretKey();
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
