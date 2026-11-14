'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_PATH } from '@/lib/config';

const ITEMS = [
  { href: ADMIN_PATH, label: 'Dashboard', exact: true },
  { href: `${ADMIN_PATH}/cases`, label: 'Cases', exact: false },
  { href: `${ADMIN_PATH}/inquiries`, label: 'Consultation requests', exact: false },
  { href: `${ADMIN_PATH}/site`, label: 'Site details', exact: false },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration" className="flex gap-1 overflow-x-auto px-2 whitespace-nowrap md:flex-col">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md px-2.5 py-1.5 text-sm ${
              active ? 'bg-navy-700 font-medium text-white' : 'hover:bg-navy-800 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
