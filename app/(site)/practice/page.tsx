import type { Metadata } from 'next';
import { NextSteps, PageHeader, PracticeCards, SectionHeading } from '@/components/public/PageParts';
import { OTHER_MATTERS, PRACTICE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Areas of practice',
  description: 'Constitutional writ petitions, civil litigation and criminal litigation across Pakistan.',
};

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Areas of practice"
        lead="Constitutional, civil and criminal litigation before the Supreme Court, the High Courts and the District Courts of Pakistan, from the first petition to the final order."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
        <PracticeCards items={PRACTICE} />

        <div className="mt-14">
          <SectionHeading eyebrow="Also handled" title="Other matters" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {OTHER_MATTERS.map((m) => (
              <li key={m} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-navy">
                {m}
              </li>
            ))}
          </ul>
        </div>

        <NextSteps
          links={[
            { href: '/contact', label: 'Discuss your matter', primary: true },
            { href: '/cases', label: 'See landmark cases' },
          ]}
        />
      </section>
    </>
  );
}
