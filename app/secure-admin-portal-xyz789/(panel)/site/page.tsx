import type { Metadata } from 'next';
import { SiteDetailsForm } from '@/components/admin/SiteDetailsForm';
import { getSiteDetails } from '@/lib/data';

export const metadata: Metadata = { title: 'Site details' };

export default async function SiteDetailsPage() {
  const details = await getSiteDetails();

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-navy">Site details</h1>
        <p className="mt-1 text-sm text-muted">
          The chamber’s introduction and contact details as shown on the public site: the top section, the contact
          section, the footer and the WhatsApp button.
        </p>
      </div>
      <section className="rounded-lg border border-line bg-white p-4 sm:p-5">
        <SiteDetailsForm details={details} />
      </section>
    </div>
  );
}
