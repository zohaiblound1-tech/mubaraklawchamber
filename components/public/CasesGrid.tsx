'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/config';
import type { CasePhoto } from '@/lib/types';

export type PublicCase = {
  id: number;
  title: string;
  caseNumber: string;
  court: string;
  bench: string;
  category: string;
  status: string;
  filedOn: string | null;
  decidedOn: string | null;
  summary: string;
  details: string;
  photos: CasePhoto[];
};

export function CasesGrid({ cases }: { cases: PublicCase[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = cases.find((c) => c.id === openId) ?? null;

  if (cases.length === 0) {
    return (
      <p className="rounded-lg border border-line bg-white p-6 text-sm text-muted">
        Landmark cases will be published here shortly.
      </p>
    );
  }

  return (
    <>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setOpenId(c.id)}
              className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-line bg-white text-left transition-colors hover:border-slate-400"
            >
              {c.photos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.photos[0].url}
                  alt=""
                  loading="lazy"
                  className="aspect-[16/9] w-full border-b border-line bg-stone object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-muted tabular-nums">{c.caseNumber}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="mt-3 font-serif text-lg leading-snug font-semibold text-navy">{c.title}</h3>
                <p className="mt-1 text-xs font-medium text-brass">
                  {c.court} · {c.bench}
                </p>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-ink">{c.summary}</p>
                <p className="mt-auto pt-4 text-xs font-medium text-muted group-hover:text-navy">
                  View details and {c.photos.length} photos →
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
      {open && <CaseModal item={open} onClose={() => setOpenId(null)} />}
    </>
  );
}

function CaseModal({ item, onClose }: { item: PublicCase; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = item.photos.length;
  const photo = item.photos[index];

  const step = useCallback(
    (delta: number) => setIndex((i) => (count ? (i + delta + count) % count : 0)),
    [count],
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomed) setZoomed(false);
        else onClose();
      } else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomed, onClose, step]);

  const facts: [string, string][] = [
    ['Case no.', item.caseNumber],
    ['Court', item.court],
    ['Bench', item.bench],
    ['Category', item.category],
    ['Filed', formatDate(item.filedOn)],
    ['Decided', item.decidedOn ? formatDate(item.decidedOn) : 'Pending'],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-modal-title"
        className="flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-lg bg-white sm:rounded-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />
              <span className="text-xs font-medium text-muted tabular-nums">{item.caseNumber}</span>
            </div>
            <h3 id="case-modal-title" className="mt-2 font-serif text-xl leading-snug font-semibold text-navy">
              {item.title}
            </h3>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="btn btn-quiet shrink-0">
            Close
          </button>
        </div>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1.25fr_1fr]">
          {/* Gallery */}
          <div className="border-b border-line bg-stone p-4 lg:border-r lg:border-b-0">
            {photo ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setZoomed(true)}
                    className="block w-full cursor-zoom-in overflow-hidden rounded-md border border-line bg-white"
                    aria-label="Enlarge photo"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption || `Case photo ${index + 1}`}
                      className="aspect-[4/3] max-h-[60dvh] w-full object-contain"
                    />
                  </button>
                  {count > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        aria-label="Previous photo"
                        className="btn btn-primary absolute top-1/2 left-2 h-10 w-10 -translate-y-1/2 px-0"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        aria-label="Next photo"
                        className="btn btn-primary absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2 px-0"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3 text-xs">
                  <p className="text-ink">{photo.caption}</p>
                  <p className="shrink-0 text-muted tabular-nums">
                    {index + 1} / {count}
                  </p>
                </div>
                <ul className="mt-3 grid grid-cols-5 gap-2">
                  {item.photos.map((p, i) => (
                    <li key={`${p.url}-${i}`}>
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show photo ${i + 1}`}
                        aria-current={i === index}
                        className={`block w-full cursor-pointer overflow-hidden rounded border bg-white ${
                          i === index ? 'border-navy ring-1 ring-navy' : 'border-line hover:border-slate-400'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt="" className="aspect-square w-full object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="p-6 text-sm text-muted">No photos have been attached to this matter.</p>
            )}
          </div>

          {/* Details */}
          <div className="p-5">
            <dl className="divide-y divide-line border-y border-line text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 py-2">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <h4 className="mt-5 text-xs font-semibold tracking-[0.14em] text-brass uppercase">Summary</h4>
            <p className="mt-2 text-sm leading-6 text-ink">{item.summary}</p>
            {item.details && (
              <>
                <h4 className="mt-5 text-xs font-semibold tracking-[0.14em] text-brass uppercase">Case note</h4>
                <div className="mt-2 space-y-3 text-sm leading-6 text-ink">
                  {item.details.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {zoomed && photo && (
        <div
          className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-navy p-4"
          onClick={() => setZoomed(false)}
          role="presentation"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={photo.caption} className="max-h-full max-w-full object-contain" />
          <button type="button" className="btn btn-quiet absolute top-4 right-4" onClick={() => setZoomed(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
