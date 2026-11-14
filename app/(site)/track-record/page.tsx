import type { Metadata } from 'next';
import { LogoMark } from '@/components/LogoMark';
import { MetricGrid, NextSteps, PageHeader, SectionHeading } from '@/components/public/PageParts';
import { COURTS } from '@/lib/config';
import { metricCards } from '@/lib/content';
import { getMetrics } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Track record',
  description: 'Years of practice, results and the courts across Pakistan where the chamber appears.',
};

export default async function TrackRecordPage() {
  const metrics = await getMetrics();

  return (
    <>
      <PageHeader
        eyebrow="Track record"
        title="Our track record"
        lead="Results from the chamber’s practice, and the courts across Pakistan where it appears."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
        <MetricGrid cards={metricCards(metrics)} />

        <div className="mt-14">
          <SectionHeading eyebrow="Courts of practice · All Pakistan" title="Appearing before courts across Pakistan" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.keys(COURTS).map((court) => (
              <li key={court} className="flex gap-3 rounded-lg border border-line bg-white p-4">
                <LogoMark size={40} />
                <div className="min-w-0">
                  <p className="font-semibold text-navy">{court}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {court.startsWith('District')
                      ? 'Dera Ghazi Khan and all other districts of Pakistan'
                      : COURTS[court].join(' · ')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <NextSteps
          links={[
            { href: '/cases', label: 'See landmark cases', primary: true },
            { href: '/contact', label: 'Book a consultation' },
          ]}
        />
      </section>
    </>
  );
}
