'use client';

import { ArrowUpIcon } from '@/components/Icons';

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-slate-300 hover:text-white"
    >
      <ArrowUpIcon className="h-4 w-4" />
      Back to top
    </button>
  );
}
