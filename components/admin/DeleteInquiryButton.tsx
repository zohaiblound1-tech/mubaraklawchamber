'use client';

import { useTransition } from 'react';
import { deleteInquiryAction } from '@/lib/actions';

export function DeleteInquiryButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="btn btn-danger px-2 py-1 text-xs"
      onClick={() => {
        if (window.confirm(`Delete the consultation request from “${name}”? This cannot be undone.`)) {
          startTransition(() => deleteInquiryAction(id));
        }
      }}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
