import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NextSteps, PageHeader } from '@/components/public/PageParts';
import { PORTRAIT } from '@/lib/content';
import { getMetrics, getSiteDetails } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Mubarak Law Chamber and its principal advocate.',
};

export default async function AboutPage() {
  const [details, metrics] = await Promise.all([getSiteDetails(), getMetrics()]);

  // "Name (PhD), Advocate High Court" → name and title.
  const comma = details.principal.indexOf(',');
  const name = comma > 0 ? details.principal.slice(0, comma).trim() : details.principal;
  const role = comma > 0 ? details.principal.slice(comma + 1).trim() : '';
  const qualifications = details.qualifications
    .split(/[,\n]/)
    .map((q) => q.trim())
    .filter(Boolean);
  const paragraphs = details.about
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const facts: { k: string; v: string; href?: string }[] = [
    { k: 'Years of practice', v: metrics.yearsExperience },
    { k: 'Courts', v: 'Supreme Court, High Courts and District Courts across Pakistan', href: '/track-record' },
    { k: 'Practice', v: 'Constitutional, civil and criminal litigation', href: '/practice' },
    { k: 'Chamber', v: details.address },
  ];

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About the chamber"
        lead={`A litigation practice before the superior and district courts of Pakistan, led by ${name}.`}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,25rem)_1fr] lg:gap-14">
          {/* Portrait in the same gold frame as the homepage; stays in view while the text scrolls on desktop. */}
          <figure className="mx-auto w-full max-w-[20rem] sm:max-w-sm lg:sticky lg:top-20 lg:mx-0 lg:max-w-none lg:self-start">
            <div className="rounded-2xl bg-linear-to-br from-[#e3c27a] via-[#9c7a3c] to-[#d9b56a] p-[3px] shadow-xl shadow-navy/25">
              <div className="overflow-hidden rounded-[calc(1rem-3px)] bg-navy-800">
                <Image
                  src={PORTRAIT.src}
                  alt={`${details.principal}, seated in chambers`}
                  width={PORTRAIT.width}
                  height={PORTRAIT.height}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 384px, 320px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </figure>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-brass uppercase">Principal advocate</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-navy sm:text-4xl">{name}</h2>
            {role && <p className="mt-2 font-serif text-lg text-ink">{role}</p>}

            {qualifications.length > 0 && (
              <ul aria-label="Qualifications" className="mt-5 flex flex-wrap gap-2">
                {qualifications.map((q) => (
                  <li key={q} className="rounded-full border border-brass/40 bg-white px-3.5 py-1.5 text-sm font-medium text-navy">
                    {q}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 max-w-2xl space-y-5 text-base leading-7 text-ink">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <dl className="mt-10 grid gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.k} className="rounded-lg border border-line bg-white p-4">
                  <dt className="text-xs font-medium text-muted">{f.k}</dt>
                  <dd className="mt-1 font-semibold text-navy">
                    {f.href ? (
                      <Link href={f.href} className="underline decoration-line underline-offset-4 hover:decoration-navy">
                        {f.v}
                      </Link>
                    ) : (
                      f.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <NextSteps
              links={[
                { href: '/contact', label: 'Book a consultation', primary: true },
                { href: '/practice', label: 'Areas of practice' },
                { href: '/cases', label: 'Landmark cases' },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
