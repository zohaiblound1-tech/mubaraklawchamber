import type { Metadata } from 'next';
import { LogoMark } from '@/components/LogoMark';
import { LoginForm } from '@/components/admin/LoginForm';
import { SITE } from '@/lib/config';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone p-5">
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-line bg-white">
        <div className="on-dark flex items-center gap-3 bg-navy px-6 py-5 text-white">
          <LogoMark size={40} />
          <div>
            <p className="font-serif text-lg font-semibold">{SITE.name}</p>
            <p className="mt-0.5 text-xs text-slate-400">Chamber administration</p>
          </div>
        </div>
        <div className="p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
