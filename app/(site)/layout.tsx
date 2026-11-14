import { SiteFooter } from '@/components/public/SiteFooter';
import { SiteHeader } from '@/components/public/SiteHeader';
import { WhatsAppWidget } from '@/components/public/WhatsAppWidget';
import { getSiteDetails } from '@/lib/data';

// Every public page reads the chamber's details (and its own content) from
// the database on each request, so admin edits show immediately.
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const details = await getSiteDetails();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="top" className="flex-1">
        {children}
      </main>
      <SiteFooter details={details} />
      <WhatsAppWidget number={details.whatsapp} />
    </div>
  );
}
