import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { DEFAULT_DETAILS, SITE } from '@/lib/config';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', display: 'swap' });

export const metadata: Metadata = {
  // Inner pages read e.g. "Contact · Mubarak Law Chamber"; the homepage sets its
  // own title from the principal saved in Site details.
  title: { default: `${SITE.name} — ${DEFAULT_DETAILS.principal}`, template: `%s · ${SITE.name}` },
  description:
    'Constitutional, civil and criminal litigation before the Supreme Court, the High Courts and the District Courts across Pakistan.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F172A' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
