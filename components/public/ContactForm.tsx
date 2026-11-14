'use client';

import { useActionState } from 'react';
import { submitConsultationAction } from '@/lib/actions';
import { CATEGORIES } from '@/lib/config';

export function ContactForm() {
  const [state, action, pending] = useActionState(submitConsultationAction, null);

  if (state?.ok) {
    return (
      <div role="status" className="py-8">
        <p className="font-serif text-xl font-semibold text-navy">Request received</p>
        <p className="mt-2 text-sm leading-6 text-ink">{state.ok}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="c-name">Full name</label>
        <input id="c-name" name="name" required maxLength={120} autoComplete="name" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="c-phone">Phone number</label>
        <input id="c-phone" name="phone" type="tel" required maxLength={40} autoComplete="tel" placeholder="+92 3xx xxxxxxx" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="c-email">Email (optional)</label>
        <input id="c-email" name="email" type="email" maxLength={160} autoComplete="email" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="c-date">Preferred date (optional)</label>
        <input id="c-date" name="preferredDate" type="date" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="c-matter">Nature of matter</label>
        <select id="c-matter" name="matterType" className="field" defaultValue="">
          <option value="">Select…</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
          <option>Other</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="c-message">Brief description</label>
        <textarea id="c-message" name="message" required maxLength={3000} rows={5} className="field" />
      </div>
      {/* Honeypot field for bots; hidden from people and assistive technology. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn btn-primary px-4 py-2">
          {pending ? 'Sending…' : 'Request consultation'}
        </button>
        {state?.error && (
          <p role="alert" className="text-sm font-medium text-crimson">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
