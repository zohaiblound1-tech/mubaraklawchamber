'use client';

import { useActionState } from 'react';
import { saveMetricsAction } from '@/lib/actions';
import type { Metrics } from '@/lib/config';

const FIELDS: { name: keyof Metrics; label: string }[] = [
  { name: 'yearsExperience', label: 'Years of practice' },
  { name: 'successRate', label: 'Success rate' },
  { name: 'casesResolved', label: 'Cases resolved' },
];

export function MetricsForm({ metrics }: { metrics: Metrics }) {
  const [state, action, pending] = useActionState(saveMetricsAction, null);
  return (
    <form action={action} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label className="label" htmlFor={`m-${f.name}`}>{f.label}</label>
            <input id={`m-${f.name}`} name={f.name} defaultValue={metrics[f.name]} required maxLength={12} className="field tabular-nums" />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted">
        These figures are published as stated. Only enter numbers the chamber can substantiate.
      </p>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Saving…' : 'Save figures'}
        </button>
        {state?.ok && <p role="status" className="text-xs font-medium text-forest">{state.ok}</p>}
        {state?.error && <p role="alert" className="text-xs font-medium text-crimson">{state.error}</p>}
      </div>
    </form>
  );
}
