import Link from 'next/link';
import { MetricsForm } from '@/components/admin/MetricsForm';
import { StatusBadge } from '@/components/StatusBadge';
import { ADMIN_PATH, formatDate } from '@/lib/config';
import { computeStats, getMetrics, listCases, listInquiries } from '@/lib/data';

export default async function DashboardPage() {
  const [all, metrics, inquiries] = await Promise.all([listCases(), getMetrics(), listInquiries()]);
  const stats = computeStats(all);
  const newInquiries = inquiries.filter((i) => i.status === 'New');

  const tiles = [
    { label: 'Total cases', value: stats.total, note: `${stats.landmark} published as landmark` },
    { label: 'Active (pending)', value: stats.active, note: 'Awaiting decision' },
    { label: 'Decided', value: stats.decided, note: `${stats.favourable} favourable` },
    {
      label: 'Success rate',
      value: stats.successRate === null ? '—' : `${stats.successRate}%`,
      note: 'Favourable ÷ decided, from records',
    },
    { label: 'New requests', value: newInquiries.length, note: `${inquiries.length} total` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-navy">Dashboard</h1>
        <div className="flex gap-2">
          <Link href={`${ADMIN_PATH}/cases`} className="btn btn-quiet">
            Manage cases
          </Link>
          <Link href={`${ADMIN_PATH}/cases/new`} className="btn btn-primary">
            Add case
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-lg border border-line bg-white p-4">
            <p className="text-xs font-medium text-muted">{t.label}</p>
            <p className="mt-1 text-2xl font-semibold text-navy tabular-nums">{t.value}</p>
            <p className="mt-0.5 text-xs text-muted">{t.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-lg border border-line bg-white">
          <h2 className="border-b border-line px-4 py-3 text-sm font-semibold text-navy">Caseload by court</h2>
          <div className="overflow-x-auto">
            <table className="rtable w-full">
              <thead className="border-b border-line bg-stone">
                <tr>
                  <th className="th">Court</th>
                  <th className="th text-right">Total</th>
                  <th className="th text-right">Active</th>
                  <th className="th text-right">Decided</th>
                  <th className="th text-right">Favourable</th>
                  <th className="th text-right">Success</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {stats.byCourt.map((row) => (
                  <tr key={row.court}>
                    <td data-label="Court" className="td font-medium">{row.court}</td>
                    <td data-label="Total" className="td text-right tabular-nums">{row.total}</td>
                    <td data-label="Active" className="td text-right tabular-nums">{row.active}</td>
                    <td data-label="Decided" className="td text-right tabular-nums">{row.decided}</td>
                    <td data-label="Favourable" className="td text-right tabular-nums">{row.favourable}</td>
                    <td data-label="Success" className="td text-right tabular-nums">
                      {row.decided ? `${Math.round((row.favourable / row.decided) * 100)}%` : '—'}
                    </td>
                  </tr>
                ))}
                {stats.byCourt.length === 0 && (
                  <tr>
                    <td className="td text-muted" colSpan={6}>
                      No cases recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white">
          <h2 className="border-b border-line px-4 py-3 text-sm font-semibold text-navy">Figures shown on public site</h2>
          <div className="p-4">
            <MetricsForm metrics={metrics} />
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-sm font-semibold text-navy">Latest consultation requests</h2>
          <Link href={`${ADMIN_PATH}/inquiries`} className="text-xs font-medium text-muted hover:text-navy">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="rtable w-full">
            <tbody className="divide-y divide-line">
              {inquiries.slice(0, 5).map((i) => (
                <tr key={i.id}>
                  <td data-label="Name" className="td font-medium md:whitespace-nowrap">{i.name}</td>
                  <td data-label="Phone" className="td whitespace-nowrap tabular-nums">{i.phone}</td>
                  <td data-label="Matter" className="td text-muted">{i.matterType || '—'}</td>
                  <td data-label="Received" className="td whitespace-nowrap text-muted">{formatDate(i.createdAt)}</td>
                  <td data-label="Status" className="td text-right">
                    <StatusBadge status={i.status} />
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td className="td text-muted">No consultation requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
