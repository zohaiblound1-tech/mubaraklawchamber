// Shared constants. Keep this file free of server-only imports: it is used by
// middleware, server code and client components.

/** Unlisted admin route. To change it, rename the folder in /app and update
 *  this constant and the matcher in /middleware.ts. */
export const ADMIN_PATH = '/secure-admin-portal-xyz789';

export const SITE = { name: 'Mubarak Law Chamber' };

/** Chamber details shown on the public site. The admin edits them under
 *  "Site details"; these values apply until something is saved there. */
export type SiteDetails = {
  principal: string;
  tagline: string;
  intro: string;
  qualifications: string;
  about: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
};

export const DEFAULT_DETAILS: SiteDetails = {
  principal: 'Sardar Rafiq Ahmad Khan Lound (PhD), Advocate High Court',
  tagline: 'Advocates practising in courts across Pakistan',
  intro:
    'Litigation counsel for constitutional, civil and criminal matters. We represent individuals, companies and public bodies before the Supreme Court, the High Courts and the District Courts throughout Pakistan, from the first petition to the final order.',
  qualifications: 'Advocate High Court, LLM, PhD Law Scholar',
  about: [
    'Mubarak Law Chamber is a litigation practice based at the District Courts, Dera Ghazi Khan. The chamber represents individuals, companies and public bodies before the Supreme Court of Pakistan, the High Courts and the District Courts throughout the country.',
    'The chamber is led by Sardar Rafiq Ahmad Khan Lound, Advocate High Court, who holds an LLM and is a PhD law scholar. The practice covers constitutional writ petitions, civil litigation and criminal litigation, as well as family and guardianship, service and employment, and banking and recovery matters.',
    'Clients are advised in plain terms on where their case stands and what comes next, from the first consultation to the final order.',
  ].join('\n\n'),
  phone: '0333 6023706',
  whatsapp: '0333 6023706',
  email: 'rafiqkhan234@gmail.com',
  address: 'District Courts (Criminal Side), Dera Ghazi Khan, Punjab, Pakistan',
  hours: 'Monday – Saturday, 9:00 am – 6:00 pm',
  facebook: 'https://www.facebook.com/share/19n6ywTb97/',
};

export const DETAIL_FIELDS: {
  key: keyof SiteDetails;
  label: string;
  max: number;
  hint?: string;
  rows?: number;
  type?: 'email' | 'url' | 'tel';
  optional?: boolean;
}[] = [
  {
    key: 'principal',
    label: 'Principal advocate',
    max: 120,
    hint: 'Shown under the chamber name, on the About page and in the footer. Name first, then a comma and the title.',
  },
  { key: 'tagline', label: 'Tagline', max: 120, hint: 'Small line above the chamber name.' },
  { key: 'intro', label: 'Introduction (homepage)', max: 800, rows: 4, hint: 'Paragraph beside the portrait on the homepage.' },
  {
    key: 'qualifications',
    label: 'Qualifications (About page)',
    max: 200,
    optional: true,
    hint: 'Separate with commas, e.g. Advocate High Court, LLM, PhD Law Scholar.',
  },
  {
    key: 'about',
    label: 'About the chamber (About page)',
    max: 3000,
    rows: 8,
    hint: 'Leave a blank line between paragraphs.',
  },
  { key: 'phone', label: 'Telephone', max: 40, type: 'tel', hint: 'As visitors should see it, e.g. 0333 6023706.' },
  { key: 'whatsapp', label: 'WhatsApp number', max: 40, type: 'tel', hint: 'Local (0333…) or international (+92…) format.' },
  { key: 'email', label: 'Email', max: 160, type: 'email' },
  { key: 'address', label: 'Chamber address', max: 200, hint: 'Also used for the “Get directions” map link.' },
  { key: 'hours', label: 'Office hours', max: 120 },
  { key: 'facebook', label: 'Facebook page link', max: 300, type: 'url', hint: 'Must start with https://' },
];

/** International digits for a Pakistani number written locally (0333 …) or
 *  internationally (+92 333 …). */
export function intlDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (phone.trim().startsWith('+')) return digits;
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  return digits;
}

export const telHref = (phone: string) => `tel:+${intlDigits(phone)}`;

export const whatsappLink = (number: string, message = 'Assalam-o-Alaikum, I would like to book a consultation.') =>
  `https://wa.me/${intlDigits(number)}?text=${encodeURIComponent(message)}`;

export const COURTS: Record<string, string[]> = {
  'Supreme Court of Pakistan': [
    'Principal Seat, Islamabad',
    'Lahore Registry',
    'Karachi Registry',
    'Peshawar Registry',
    'Quetta Registry',
  ],
  'Lahore High Court': [
    'Principal Seat, Lahore',
    'Rawalpindi Bench',
    'Multan Bench',
    'Bahawalpur Bench',
  ],
  'Islamabad High Court': ['Islamabad'],
  'Sindh High Court': [
    'Principal Seat, Karachi',
    'Sukkur Bench',
    'Hyderabad Circuit Court',
    'Larkana Circuit Court',
  ],
  'Peshawar High Court': [
    'Principal Seat, Peshawar',
    'Abbottabad Bench',
    'Mingora Bench (Dar-ul-Qaza), Swat',
    'Bannu Bench',
    'D.I. Khan Bench',
  ],
  'High Court of Balochistan': ['Principal Seat, Quetta', 'Sibi Bench', 'Turbat Bench'],
  'Federal Shariat Court': ['Islamabad'],
  'District & Sessions Courts': [
    'Dera Ghazi Khan',
    'Lahore',
    'Multan',
    'Rawalpindi',
    'Islamabad',
    'Karachi',
    'Peshawar',
    'Quetta',
    'Other district',
  ],
};

export const CATEGORIES = [
  'Constitutional Writ Petition (Art. 199)',
  'Civil (CPC, 1908)',
  'Criminal (CrPC, 1898)',
  'Family & Guardianship',
  'Service & Employment',
  'Banking & Commercial',
];

export const STATUSES = ['Allowed', 'Acquittal', 'Settled', 'Pending', 'Dismissed'] as const;
export type CaseStatus = (typeof STATUSES)[number];

/** Outcomes counted as favourable when computing the success rate. */
export const FAVOURABLE: string[] = ['Allowed', 'Acquittal', 'Settled'];

export const INQUIRY_STATUSES = ['New', 'Contacted', 'Closed'] as const;

export const MIN_PHOTOS = 4;
export const MAX_PHOTOS = 5;

export const DEFAULT_METRICS = {
  yearsExperience: '10+',
  successRate: '94%',
  casesResolved: '500+',
};
export type Metrics = typeof DEFAULT_METRICS;

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(`${value.slice(0, 10)}T00:00:00Z`) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
