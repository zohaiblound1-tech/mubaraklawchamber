import Link from 'next/link';
import { FacebookIcon, WhatsAppIcon } from '@/components/BrandIcons';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/Icons';
import { LogoMark } from '@/components/LogoMark';
import { BackToTop } from '@/components/public/BackToTop';
import { SITE, type SiteDetails, telHref, whatsappLink } from '@/lib/config';

const PRACTICE_AREAS = [
  'Criminal cases & bail',
  'Constitutional writ petitions',
  'Civil suits & appeals',
  'Family & guardianship',
  'Service matters',
  'Banking & recovery',
];

const QUICK_LINKS = [
  ['Home', '/'],
  ['About the chamber', '/about'],
  ['Areas of practice', '/practice'],
  ['Track record', '/track-record'],
  ['Landmark cases', '/cases'],
  ['Book a consultation', '/contact'],
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">{children}</h2>;
}

export function SiteFooter({ details }: { details: SiteDetails }) {
  const year = new Date().getFullYear();
  const phoneHref = telHref(details.phone);
  const chatHref = whatsappLink(details.whatsapp);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`;

  return (
    <footer className="on-dark bg-navy text-slate-300">
      {/* Call-to-action band */}
      <div className="border-b border-navy-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-serif text-2xl leading-tight font-semibold text-white sm:text-3xl">
              Need legal advice on a case?
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Speak directly with {details.principal}, about criminal, civil or constitutional matters anywhere
              in Pakistan.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:shrink-0">
            <a href={phoneHref} className="btn bg-white px-4 py-2.5 text-navy hover:bg-slate-200">
              <PhoneIcon className="h-4 w-4" />
              Call {details.phone}
            </a>
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#1FAF54] px-4 py-2.5 text-white hover:bg-[#178F44]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-5 lg:grid-cols-[1.2fr_1.5fr_1fr_0.9fr] lg:gap-8">
        <div>
          <LogoMark size={52} className="p-0.5" />
          <p className="mt-3 font-serif text-xl font-semibold text-white">{SITE.name}</p>
          <p className="mt-1 text-sm text-slate-300">{details.principal}</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Advocates practising before the Supreme Court, the High Courts and the District Courts across Pakistan.
          </p>
          <div className="mt-5 flex gap-2.5">
            <a
              href={details.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook page"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1877F2] transition-colors hover:bg-slate-200"
            >
              <FacebookIcon className="h-10 w-10" />
            </a>
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp chat"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1FAF54]"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <Heading>Contact the chamber</Heading>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <div>
                <p className="leading-6 text-white">{details.address}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-slate-400 underline underline-offset-4 hover:text-white"
                >
                  Get directions
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <a href={phoneHref} className="leading-6 text-white hover:underline hover:underline-offset-4">
                {details.phone} <span className="text-slate-400">(Call &amp; WhatsApp)</span>
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <a
                href={`mailto:${details.email}`}
                className="min-w-0 leading-6 break-all text-white hover:underline hover:underline-offset-4"
              >
                {details.email}
              </a>
            </li>
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <p className="leading-6 text-white">{details.hours}</p>
            </li>
          </ul>
        </div>

        {/* Side by side on phones and tablets; separate columns on desktop. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:col-span-2 lg:contents">
          <div>
            <Heading>Practice areas</Heading>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRACTICE_AREAS.map((area) => (
                <li key={area}>
                  <Link href="/practice" className="text-slate-300 hover:text-white">
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <Heading>Quick links</Heading>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-300 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar. Extra bottom padding on phones keeps the floating WhatsApp button off the text. */}
      <div className="border-t border-navy-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-6 pb-24 text-xs leading-5 text-slate-400 sm:px-5 md:flex-row md:items-center md:justify-between md:pb-6 md:pr-24">
          <div>
            <p>
              © {year} {SITE.name}. All rights reserved.
            </p>
            <p>This website provides general information only and is not legal advice.</p>
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
