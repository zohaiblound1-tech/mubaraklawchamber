import type { Metadata } from 'next';
import { CasesGrid } from '@/components/public/CasesGrid';
import { NextSteps, PageHeader } from '@/components/public/PageParts';
import { toPublicCases } from '@/lib/content';
import { listLandmarkCases } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Landmark cases',
  description: 'Selected litigated matters, with judgment excerpts, court seals and petition filings on record.',
};

export default async function CasesPage() {
  const cases = toPublicCases(await listLandmarkCases());

  return (
    <>
      <PageHeader
        eyebrow="Landmark cases & verdicts"
        title="Selected litigated matters"
        lead="Select a matter to read the full note and view the judgment excerpts, court seals and petition filings on record."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
        <CasesGrid cases={cases} />
        <NextSteps
          links={[
            { href: '/contact', label: 'Discuss a similar matter', primary: true },
            { href: '/practice', label: 'Areas of practice' },
          ]}
        />
      </section>
    </>
  );
}
