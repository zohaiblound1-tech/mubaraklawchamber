import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CasesGrid } from '@/components/public/CasesGrid';
import { MetricGrid, PracticeCards, SectionHeading } from '@/components/public/PageParts';
import { SITE } from '@/lib/config';
import { PORTRAIT, PRACTICE, metricCards, toPublicCases } from '@/lib/content';
import { getMetrics, getSiteDetails, listLandmarkCases } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const details = await getSiteDetails();
  return { title: { absolute: `${SITE.name} — ${details.principal}` } };
}

export default async function HomePage() {
  const [metrics, landmark, details] = await Promise.all([getMetrics(), listLandmarkCases(), getSiteDetails()]);
  const latest = toPublicCases(landmark.slice(0, 3));

  return (
    <>
      {/* Hero */}
      <section className="on-dark bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-16 sm:px-5 sm:pt-16 sm:pb-20 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-14">
          {/* Principal advocate's portrait, first on the left (top on phones), in a gold frame. */}
          <figure className="mx-auto w-full max-w-[20rem] sm:max-w-sm lg:mx-0 lg:max-w-md">
            <div className="rounded-2xl bg-linear-to-br from-[#e3c27a] via-[#9c7a3c] to-[#d9b56a] p-[3px] shadow-2xl shadow-black/50">
              <div className="overflow-hidden rounded-[calc(1rem-3px)] bg-navy-800">
                <Image
                  src={PORTRAIT.src}
                  alt={`${details.principal}, seated in chambers`}
                  width={PORTRAIT.width}
                  height={PORTRAIT.height}
                  priority
                  sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, 320px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </figure>

          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">{details.tagline}</p>
            <h1 className="mt-4 font-serif text-[clamp(2rem,8vw,3.75rem)] leading-[1.1] font-semibold tracking-tight text-balance">
              {SITE.name}
            </h1>
            <p className="mt-3 font-serif text-lg text-slate-300 sm:text-xl">{details.principal}</p>
            <p className="mt-6 max-w-xl text-base leading-7 whitespace-pre-line text-slate-300">{details.intro}</p>
            <Link
              href="/about"
              className="mt-3 inline-block text-sm font-semibold text-white underline decoration-slate-500 underline-offset-4 hover:decoration-white"
            >
              More about the chamber <span aria-hidden="true">→</span>
            </Link>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/contact" className="btn bg-white px-4 py-2.5 text-navy hover:bg-slate-200">
                Book a consultation
              </Link>
              <Link href="/cases" className="btn bg-navy-700 px-4 py-2.5 text-white hover:bg-navy-800">
                View landmark cases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Figures, overlapping the hero */}
      <section aria-label="Track record" className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="-mt-8">
          <MetricGrid cards={metricCards(metrics)} />
        </div>
        <p className="mt-3 text-right">
          <Link href="/track-record" className="text-sm font-semibold text-navy underline decoration-line underline-offset-4 hover:decoration-navy">
            Our track record and courts <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>

      {/* Practice preview */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-5 sm:pt-16">
        <SectionHeading eyebrow="Practice" title="Areas of practice" link={{ href: '/practice', label: 'All areas of practice' }} />
        <div className="mt-8">
          <PracticeCards items={PRACTICE} />
        </div>
      </section>

      {/* Latest landmark cases */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <SectionHeading
          eyebrow="Landmark cases & verdicts"
          title="Recent litigated matters"
          link={{ href: '/cases', label: 'View all landmark cases' }}
        />
        <div className="mt-8">
          <CasesGrid cases={latest} />
        </div>
      </section>
    </>
  );
}
