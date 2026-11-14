import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteCaseButton } from '@/components/admin/DeleteCaseButton';
import { StatusBadge } from '@/components/StatusBadge';
import { ADMIN_PATH, COURTS, MAX_PHOTOS, STATUSES, formatDate } from '@/lib/config';
import { listCases } from '@/lib/data';

export const metadata: Metadata = { title: 'Cases' };

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; court?: string }>;
}) {
  const { q = '', status = '', court = '' } = await searchParams;
  const all = await listCases();
  const needle = q.trim().toLowerCase();
  const rows = all.filter(
    (c) =>
      (!status || c.status === status) &&
      (!court || c.court === court) &&
      (!needle || `${c.title} ${c.caseNumber} ${c.category}`.toLowerCase().includes(needle)),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-navy">
          Cases <span className="ml-1 text-sm font-normal text-muted tabular-nums">{rows.length} of {all.length}</span>
        </h1>
        <Link href={`${ADMIN_PATH}/cases/new`} className="btn btn-primary">
          Add case
        </Link>
      </div>

      <form className="grid grid-cols-2 items-end gap-2 sm:flex sm:flex-wrap" method="get">
        <div className="col-span-2 min-w-48 flex-1">
          <label className="label" htmlFor="q">Search</label>
          <input id="q" name="q" defaultValue={q} placeholder="Title, case number or category" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="court">Court</label>
          <select id="court" name="court" defaultValue={court} className="field">
            <option value="">All courts</option>
            {Object.keys(COURTS).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={status} className="field">
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-quiet col-span-2 sm:col-span-1">Filter</button>
        {(q || status || court) && (
          <Link href={`${ADMIN_PATH}/cases`} className="btn btn-quiet">
            Clear
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="rtable w-full md:min-w-[60rem]">
          <thead className="border-b border-line bg-stone">
            <tr>
              <th className="th">Case no.</th>
              <th className="th">Title</th>
              <th className="th">Court / bench</th>
              <th className="th">Category</th>
              <th className="th">Status</th>
              <th className="th">Decided</th>
              <th className="th text-right">Photos</th>
              <th className="th">Public</th>
              <th className="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-stone">
                <td data-label="Case no." className="td whitespace-nowrap tabular-nums">{c.caseNumber}</td>
                <td data-label="Title" className="td font-medium md:max-w-72">
                  <Link href={`${ADMIN_PATH}/cases/${c.id}`} className="hover:underline">
                    {c.title}
                  </Link>
                </td>
                <td data-label="Court" className="td">
                  <div>
                    {c.court}
                    <span className="block text-xs text-muted">{c.bench}</span>
                  </div>
                </td>
                <td data-label="Category" className="td text-muted">{c.category}</td>
                <td data-label="Status" className="td">
                  <StatusBadge status={c.status} />
                </td>
                <td data-label="Decided" className="td whitespace-nowrap tabular-nums">{formatDate(c.decidedOn)}</td>
                <td data-label="Photos" className="td text-right tabular-nums">
                  {c.photos.length}/{MAX_PHOTOS}
                </td>
                <td data-label="Public" className="td">{c.isLandmark ? 'Landmark' : <span className="text-muted">—</span>}</td>
                <td data-label="Actions" className="td">
                  <div className="flex justify-end gap-1.5">
                    <Link href={`${ADMIN_PATH}/cases/${c.id}`} className="btn btn-quiet px-2 py-1 text-xs">
                      Edit
                    </Link>
                    <DeleteCaseButton id={c.id} title={c.title} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="td text-muted" colSpan={9}>
                  No cases match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
