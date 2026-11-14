'use client';

import { useTransition } from 'react';
import { deleteCaseAction } from '@/lib/actions';

export function DeleteCaseButton({ id, title }: { id: number; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="btn btn-danger px-2 py-1 text-xs"
      onClick={() => {
        if (window.confirm(`Delete “${title}” and its photos? This cannot be undone.`)) {
          startTransition(() => deleteCaseAction(id));
        }
      }}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
