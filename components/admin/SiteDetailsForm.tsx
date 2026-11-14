'use client';

import { useActionState } from 'react';
import { saveSiteDetailsAction } from '@/lib/actions';
import { DETAIL_FIELDS, type SiteDetails } from '@/lib/config';

export function SiteDetailsForm({ details }: { details: SiteDetails }) {
  const [state, action, pending] = useActionState(saveSiteDetailsAction, null);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {DETAIL_FIELDS.map((f) => {
          const id = `s-${f.key}`;
          const wide = f.rows || f.key === 'address' || f.key === 'facebook' || f.key === 'qualifications';
          return (
            <div key={f.key} className={wide ? 'md:col-span-2' : undefined}>
              <label className="label" htmlFor={id}>
                {f.label}
                {f.optional && <span className="font-normal"> (optional)</span>}
              </label>
              {f.rows ? (
                <textarea id={id} name={f.key} defaultValue={details[f.key]} required={!f.optional} maxLength={f.max} rows={f.rows} className="field" />
              ) : (
                <input
                  id={id}
                  name={f.key}
                  type={f.type ?? 'text'}
                  defaultValue={details[f.key]}
                  required={!f.optional}
                  maxLength={f.max}
                  className={`field ${f.type === 'tel' ? 'tabular-nums' : ''}`}
                />
              )}
              {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Saving…' : 'Save site details'}
        </button>
        {state?.ok && <p role="status" className="text-xs font-medium text-forest">{state.ok}</p>}
        {state?.error && <p role="alert" className="text-xs font-medium text-crimson">{state.error}</p>}
      </div>
    </form>
  );
}
