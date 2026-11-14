import type { Metadata } from 'next';
import { FacebookIcon, WhatsAppIcon } from '@/components/BrandIcons';
import { ContactForm } from '@/components/public/ContactForm';
import { PageHeader } from '@/components/public/PageParts';
import { telHref, whatsappLink } from '@/lib/config';
import { getSiteDetails } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a consultation with the chamber by phone, WhatsApp, email or the request form.',
};

export default async function ContactPage() {
  const details = await getSiteDetails();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`;

  const rows = [
    { k: 'Telephone', v: details.phone, href: telHref(details.phone) },
    { k: 'WhatsApp', v: details.whatsapp, href: whatsappLink(details.whatsapp), external: true },
    { k: 'Email', v: details.email, href: `mailto:${details.email}` },
    { k: 'Chamber', v: details.address, href: mapsUrl, external: true },
    { k: 'Hours', v: details.hours },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Book a consultation"
        lead="Tell us briefly about your matter. The chamber will call you back to confirm a time. Please do not send confidential documents through this form."
      />

      {/* id="contact" lets the floating WhatsApp box step aside so it never covers the form. */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-semibold text-navy">Contact details</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              {rows.map((row) => (
                <div key={row.k} className="grid grid-cols-[5.5rem_1fr] gap-3 py-3 sm:grid-cols-[7rem_1fr]">
                  <dt className="text-muted">{row.k}</dt>
                  <dd className="min-w-0 font-medium break-words text-ink">
                    {row.href ? (
                      <a
                        href={row.href}
                        className="underline decoration-line underline-offset-4 hover:decoration-navy"
                        {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {row.v}
                      </a>
                    ) : (
                      row.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={whatsappLink(details.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#1FAF54] px-3.5 py-2 text-white hover:bg-[#178F44]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={details.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#1877F2] px-3.5 py-2 text-white hover:bg-[#1465D0]"
              >
                <FacebookIcon className="h-4 w-4" />
                Facebook page
              </a>
            </div>
          </div>
          <div className="min-w-0 rounded-lg border border-line bg-white p-4 sm:p-6">
            <h2 className="mb-5 font-serif text-xl font-semibold text-navy">Request a consultation</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
