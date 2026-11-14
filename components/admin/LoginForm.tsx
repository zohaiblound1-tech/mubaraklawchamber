'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoFocus autoComplete="current-password" className="field" />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-crimson">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary w-full py-2">
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
