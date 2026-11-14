import { cookies } from 'next/headers';
import { SESSION_COOKIE, isValidSession } from './session';

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

/** Every admin server action and route handler calls this; middleware alone is
 *  not treated as sufficient protection. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
}
