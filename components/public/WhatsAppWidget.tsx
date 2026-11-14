'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { whatsappLink } from '@/lib/config';

const MESSAGE = 'Assalam-o-Alaikum, I would like to consult about a case.';

/** Floating WhatsApp icon (a direct chat link) in the bottom-right corner,
 *  with a small message box above it. The box is open in the server-rendered
 *  HTML, so it shows immediately on every page load without waiting for
 *  JavaScript. Ids and classes avoid the word "whatsapp" because some
 *  ad-blocker lists hide elements named that way. */
export function WhatsAppWidget({ number }: { number: string }) {
  const href = whatsappLink(number, MESSAGE);
  const [open, setOpen] = useState(true);
  // True while the contact section or footer is on screen. The box steps
  // aside then so it never covers the form, contact details or footer links;
  // the round icon stays.
  const [nearBottom, setNearBottom] = useState(false);
  const showBox = open && !nearBottom;

  useEffect(() => {
    const targets = document.querySelectorAll('#contact, footer');
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setNearBottom(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!showBox) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showBox]);

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
      {showBox && (
        <div
          id="consult-box"
          className="relative w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-line bg-white p-3.5 pr-9 shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
        >
          <a href={href} target="_blank" rel="noopener noreferrer" className="block">
            <span className="block text-sm leading-5 font-semibold text-ink">
              Need a consultation or information about any case?
            </span>
            <span className="mt-1 block text-sm leading-5 text-muted">
              Contact us on WhatsApp: <span className="font-medium text-ink tabular-nums">{number}</span>
            </span>
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-[#1FAF54] px-2.5 py-1.5 text-xs font-semibold text-white">
              <WhatsAppIcon className="h-3.5 w-3.5" />
              Contact us now
            </span>
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close message box"
            className="absolute top-1 right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded text-lg leading-none text-muted hover:bg-stone hover:text-ink"
          >
            ×
          </button>
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(15,23,42,0.25)] transition-colors hover:bg-[#1FAF54]"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </a>
    </div>
  );
}
