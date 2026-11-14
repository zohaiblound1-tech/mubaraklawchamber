'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AwardIcon, BriefcaseIcon, CalendarIcon, HomeIcon, PhoneIcon, ScalesIcon, UserIcon } from '@/components/Icons';
import { LogoMark } from '@/components/LogoMark';
import { SITE } from '@/lib/config';
import { NAV } from '@/lib/content';

const ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  '/': HomeIcon,
  '/about': UserIcon,
  '/practice': BriefcaseIcon,
  '/track-record': AwardIcon,
  '/cases': ScalesIcon,
  '/contact': PhoneIcon,
};

const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <header className="on-dark sticky top-0 z-30 bg-navy text-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 font-serif text-base font-semibold tracking-tight whitespace-nowrap sm:text-lg"
          >
            <LogoMark size={32} />
            {SITE.name}
          </Link>

          {/* Laptops and larger: the pages as a text menu in the bar. */}
          <nav aria-label="Primary" className="hidden items-center gap-5 text-sm lg:flex xl:gap-6">
            {NAV.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`border-b-2 py-1 whitespace-nowrap ${
                    current ? 'border-brass-light font-medium text-white' : 'border-transparent text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Phones and tablets: gold "Book now", in the same gold as the portrait frame. */}
          <Link
            href="/contact"
            className="btn shrink-0 gap-1.5 bg-linear-to-b from-[#ecd08f] to-[#cfa65a] px-3 py-2 font-semibold text-navy shadow-sm shadow-black/40 transition-transform hover:from-[#f3dca6] hover:to-[#d8b268] active:scale-95 lg:hidden"
          >
            <CalendarIcon className="hidden h-4 w-4 min-[380px]:block" />
            Book now
          </Link>
          <Link href="/contact" className="btn hidden shrink-0 bg-white text-navy hover:bg-slate-200 lg:inline-flex">
            Book a consultation
          </Link>
        </div>
      </header>

      {/* Phones and tablets: every page as an icon button in one row, like an app's tab bar. */}
      <nav aria-label="Primary" className="on-dark border-t border-navy-700 bg-navy lg:hidden">
        <ul className="mx-auto grid max-w-3xl grid-cols-6 gap-1 px-2 py-2 sm:gap-2 sm:px-5">
          {NAV.map((item) => {
            const current = isCurrent(pathname, item.href);
            const Icon = ICONS[item.href] ?? HomeIcon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`group relative flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] leading-none font-medium transition active:scale-95 sm:h-16 sm:gap-1.5 sm:text-xs ${
                    current ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${current ? 'text-brass-light' : 'text-slate-400 group-hover:text-slate-200'}`}
                  />
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  {current && (
                    <span aria-hidden="true" className="absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-brass-light" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
