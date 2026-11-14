const TONES: Record<string, string> = {
  Allowed: 'bg-forest',
  Acquittal: 'bg-forest',
  Settled: 'bg-slate-600',
  Pending: 'bg-amber-deep',
  Dismissed: 'bg-crimson',
  New: 'bg-amber-deep',
  Contacted: 'bg-slate-600',
  Closed: 'bg-forest',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] leading-4 font-semibold tracking-wide text-white uppercase ${TONES[status] ?? 'bg-slate-600'}`}
    >
      {status}
    </span>
  );
}
