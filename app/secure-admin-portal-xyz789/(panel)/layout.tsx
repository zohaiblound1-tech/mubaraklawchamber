import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogoMark } from '@/components/LogoMark';
import { AdminNav } from '@/components/admin/AdminNav';
import { logoutAction } from '@/lib/actions';
import { isAdmin } from '@/lib/auth';
import { ADMIN_PATH, SITE } from '@/lib/config';
import { usingNeon } from '@/lib/db';

export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s · Administration' },
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect(`${ADMIN_PATH}/login`);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[14rem_1fr]">
      <aside className="on-dark flex flex-col bg-navy text-slate-300 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center gap-2.5 px-4 py-4">
          <LogoMark size={36} />
          <div>
            <p className="font-serif text-base font-semibold text-white">{SITE.name}</p>
            <p className="text-xs text-slate-400">Chamber administration</p>
          </div>
        </div>
        <AdminNav />
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-3 text-xs md:block md:space-y-2 md:py-4">
          <p className="flex items-center gap-2 text-slate-400">
            <span className={`h-2 w-2 rounded-full ${usingNeon ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {usingNeon ? 'Neon PostgreSQL' : 'Local database (dev)'}
          </p>
          <a href="/" target="_blank" rel="noreferrer" className="block hover:text-white">
            View public site ↗
          </a>
          <form action={logoutAction}>
            <button type="submit" className="cursor-pointer hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-6">{children}</main>
    </div>
  );
}
