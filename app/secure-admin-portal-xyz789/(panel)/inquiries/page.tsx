import type { Metadata } from 'next';
import { StatusBadge } from '@/components/StatusBadge';
import { DeleteInquiryButton } from '@/components/admin/DeleteInquiryButton';
import { setInquiryStatusAction } from '@/lib/actions';
import { INQUIRY_STATUSES, formatDate } from '@/lib/config';
import { listInquiries } from '@/lib/data';

export const metadata: Metadata = { title: 'Consultation requests' };

export default async function InquiriesPage() {
  const inquiries = await listInquiries();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-navy">
        Consultation requests <span className="ml-1 text-sm font-normal text-muted tabular-nums">{inquiries.length}</span>
      </h1>
      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="rtable w-full md:min-w-[56rem]">
          <thead className="border-b border-line bg-stone">
            <tr>
              <th className="th">Received</th>
              <th className="th">Name</th>
              <th className="th">Contact</th>
              <th className="th">Matter</th>
              <th className="th">Message</th>
              <th className="th">Status</th>
              <th className="th text-right">Set status / delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {inquiries.map((i) => (
              <tr key={i.id}>
                <td data-label="Received" className="td whitespace-nowrap tabular-nums">{formatDate(i.createdAt)}</td>
                <td data-label="Name" className="td font-medium md:whitespace-nowrap">{i.name}</td>
                <td data-label="Contact" className="td tabular-nums md:whitespace-nowrap">
                  <div>
                    {i.phone}
                    {i.email && <span className="block text-xs text-muted">{i.email}</span>}
                  </div>
                </td>
                <td data-label="Matter" className="td">
                  <div>
                    {i.matterType || '—'}
                    {i.preferredDate && (
                      <span className="block text-xs text-muted">Prefers {formatDate(i.preferredDate)}</span>
                    )}
                  </div>
                </td>
                <td data-label="Message" className="td whitespace-pre-wrap md:max-w-md">{i.message}</td>
                <td data-label="Status" className="td">
                  <StatusBadge status={i.status} />
                </td>
                <td data-label="Actions" className="td">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {INQUIRY_STATUSES.filter((s) => s !== i.status).map((s) => (
                      <form key={s} action={setInquiryStatusAction.bind(null, i.id, s)}>
                        <button type="submit" className="btn btn-quiet px-2 py-1 text-xs">
                          {s}
                        </button>
                      </form>
                    ))}
                    <DeleteInquiryButton id={i.id} name={i.name} />
                  </div>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td className="td text-muted" colSpan={7}>
                  No consultation requests yet. Requests submitted on the public site appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
