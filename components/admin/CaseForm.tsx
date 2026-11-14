'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { saveCaseAction } from '@/lib/actions';
import { ADMIN_PATH, CATEGORIES, COURTS, MAX_PHOTOS, MIN_PHOTOS, STATUSES } from '@/lib/config';
import type { CaseInput, CasePhoto } from '@/lib/types';

const FIRST_COURT = Object.keys(COURTS)[0];

const EMPTY: CaseInput = {
  title: '',
  caseNumber: '',
  court: FIRST_COURT,
  bench: COURTS[FIRST_COURT][0],
  category: CATEGORIES[0],
  status: 'Pending',
  filedOn: '',
  decidedOn: '',
  summary: '',
  details: '',
  isLandmark: false,
  photos: [],
};

export function CaseForm({ heading, initial }: { heading: string; initial?: CaseInput }) {
  const [form, setForm] = useState<CaseInput>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, startSaving] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof CaseInput>(key: K, value: CaseInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setPhotos = (update: (photos: CasePhoto[]) => CasePhoto[]) =>
    setForm((f) => ({ ...f, photos: update(f.photos) }));

  const remaining = MAX_PHOTOS - form.photos.length;
  const photosOk = form.photos.length >= MIN_PHOTOS;

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, remaining)) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body });
        const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok || !json.url) {
          setError(json.error ?? `“${file.name}” could not be uploaded.`);
          break;
        }
        const url = json.url;
        setPhotos((p) => (p.length < MAX_PHOTOS ? [...p, { url, caption: '' }] : p));
      }
      if (files.length > remaining) setError(`Only ${MAX_PHOTOS} photos can be attached to a case.`);
    } catch {
      setError('The upload failed. Check your connection and try again.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function move(index: number, delta: number) {
    setPhotos((photos) => {
      const next = [...photos];
      const target = index + delta;
      if (target < 0 || target >= next.length) return photos;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startSaving(async () => {
      const result = await saveCaseAction(form);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-navy">{heading}</h1>
        <div className="flex items-center gap-2">
          <Link href={`${ADMIN_PATH}/cases`} className="btn btn-quiet">
            Cancel
          </Link>
          <button type="submit" disabled={saving || uploading} className="btn btn-primary">
            {saving ? 'Saving…' : 'Save case'}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-crimson px-3 py-2 text-sm font-medium text-white">
          {error}
        </p>
      )}

      <section className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-sm font-semibold text-navy">Case record</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-6">
          <div className="md:col-span-4">
            <label className="label" htmlFor="f-title">Title</label>
            <input id="f-title" required maxLength={200} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Petitioner v. Respondent" className="field" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="f-number">Case number</label>
            <input id="f-number" required maxLength={80} value={form.caseNumber} onChange={(e) => set('caseNumber', e.target.value)} placeholder="W.P. No. 1234/2024" className="field" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="f-court">Court</label>
            <select
              id="f-court"
              value={form.court}
              onChange={(e) => setForm((f) => ({ ...f, court: e.target.value, bench: COURTS[e.target.value][0] }))}
              className="field"
            >
              {Object.keys(COURTS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="f-bench">Seat / bench</label>
            <select id="f-bench" value={form.bench} onChange={(e) => set('bench', e.target.value)} className="field">
              {(COURTS[form.court] ?? []).map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="f-category">Category</label>
            <select id="f-category" value={form.category} onChange={(e) => set('category', e.target.value)} className="field">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="f-status">Status</label>
            <select id="f-status" value={form.status} onChange={(e) => set('status', e.target.value)} className="field">
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="f-filed">Filed on</label>
            <input id="f-filed" type="date" value={form.filedOn} onChange={(e) => set('filedOn', e.target.value)} className="field" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="f-decided">Decided on</label>
            <input id="f-decided" type="date" value={form.decidedOn} onChange={(e) => set('decidedOn', e.target.value)} className="field" />
          </div>
          <div className="md:col-span-6">
            <label className="label" htmlFor="f-summary">Summary (shown on the case card)</label>
            <textarea id="f-summary" required maxLength={600} rows={3} value={form.summary} onChange={(e) => set('summary', e.target.value)} className="field" />
          </div>
          <div className="md:col-span-6">
            <label className="label" htmlFor="f-details">Full case note (shown in the case details; leave a blank line between paragraphs)</label>
            <textarea id="f-details" maxLength={8000} rows={8} value={form.details} onChange={(e) => set('details', e.target.value)} className="field" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-navy">
            Case photos{' '}
            <span className={`ml-1 font-normal tabular-nums ${photosOk ? 'text-forest' : 'text-muted'}`}>
              {form.photos.length} of {MAX_PHOTOS}
            </span>
          </h2>
          <p className="text-xs text-muted">
            {MIN_PHOTOS} to {MAX_PHOTOS} photos · JPEG, PNG or WebP · up to 10 MB each · first photo is the cover
          </p>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => upload(e.target.files)}
        />

        <ol className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: MAX_PHOTOS }, (_, i) => {
            const photo = form.photos[i];
            if (photo) {
              return (
                <li key={photo.url} className="overflow-hidden rounded-md border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.caption || `Photo ${i + 1}`} className="aspect-[4/3] w-full bg-stone object-cover" />
                  <div className="space-y-2 p-2">
                    <input
                      aria-label={`Caption for photo ${i + 1}`}
                      placeholder="Caption, e.g. Judgment excerpt"
                      maxLength={160}
                      value={photo.caption}
                      onChange={(e) => setPhotos((p) => p.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
                      className="field px-2 py-1 text-xs"
                    />
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex gap-1">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} className="btn btn-quiet px-2 py-0.5 text-xs">
                          ←
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === form.photos.length - 1} aria-label={`Move photo ${i + 1} later`} className="btn btn-quiet px-2 py-0.5 text-xs">
                          →
                        </button>
                      </div>
                      <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} className="btn btn-quiet px-2 py-0.5 text-xs text-crimson">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            }
            const isNext = i === form.photos.length;
            return (
              <li key={`empty-${i}`}>
                <button
                  type="button"
                  disabled={!isNext || uploading}
                  onClick={() => fileInput.current?.click()}
                  className="flex aspect-[4/3] h-full min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 bg-stone text-xs text-muted hover:border-navy hover:text-navy disabled:cursor-default disabled:hover:border-slate-300 disabled:hover:text-muted"
                >
                  <span className="font-semibold">
                    Slot {i + 1}
                    {i >= MIN_PHOTOS ? ' (optional)' : ''}
                  </span>
                  <span>{isNext ? (uploading ? 'Uploading…' : 'Upload photo') : 'Empty'}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={form.isLandmark} onChange={(e) => set('isLandmark', e.target.checked)} className="mt-0.5 h-4 w-4 accent-navy" />
          <span>
            <span className="font-medium text-ink">Publish as a landmark case on the public site</span>
            <span className="block text-xs text-muted">
              Requires {MIN_PHOTOS} to {MAX_PHOTOS} photos. Unpublished cases stay internal and may be saved with fewer.
            </span>
          </span>
        </label>
      </section>
    </form>
  );
}
