// Public-site content shared by several pages.
import type { PublicCase } from '@/components/public/CasesGrid';
import type { Metrics } from './config';
import type { CaseRecord } from './data';

/** Principal advocate's portrait, used on the homepage and the About page.
 *  To replace it, put the new file in public/images and update these values. */
export const PORTRAIT = { src: '/images/advocate-portrait-desk.jpg', width: 1275, height: 1234 };

/** Main navigation: one page per entry. `short` is the label under the icon
 *  on the phone/tablet tab bar, where space is tight. */
export const NAV: { label: string; short: string; href: string }[] = [
  { label: 'Home', short: 'Home', href: '/' },
  { label: 'About', short: 'About', href: '/about' },
  { label: 'Practice', short: 'Practice', href: '/practice' },
  { label: 'Track record', short: 'Record', href: '/track-record' },
  { label: 'Landmark cases', short: 'Cases', href: '/cases' },
  { label: 'Contact', short: 'Contact', href: '/contact' },
];

export const PRACTICE = [
  {
    title: 'Constitutional Writ Petitions',
    statute: 'Article 199, Constitution of Pakistan',
    body: 'Petitions against unlawful executive and regulatory action: tax and customs recoveries, service matters, licensing, land acquisition and enforcement of fundamental rights.',
  },
  {
    title: 'Civil Litigation',
    statute: 'Code of Civil Procedure, 1908',
    body: 'Suits for declaration, possession, specific performance and recovery; injunctions under Order XXXIX; first and second appeals and civil revisions.',
  },
  {
    title: 'Criminal Litigation',
    statute: 'Code of Criminal Procedure, 1898',
    body: 'Pre-arrest and post-arrest bail under Sections 497 and 498, quashment under Section 561-A, trials, criminal appeals and revisions.',
  },
];

/** Further areas the chamber handles (also listed in the footer). */
export const OTHER_MATTERS = ['Family & guardianship', 'Service & employment matters', 'Banking & recovery'];

export function metricCards(metrics: Metrics) {
  return [
    { value: metrics.yearsExperience, label: 'Years of practice', note: 'Before the superior courts of Pakistan' },
    { value: metrics.successRate, label: 'Success rate', note: 'Matters allowed, acquitted or settled' },
    { value: metrics.casesResolved, label: 'Cases resolved', note: 'Constitutional, civil and criminal' },
    { value: 'Nationwide', label: 'Courts of practice', note: 'Supreme Court, High Courts and District Courts' },
  ];
}

/** Only the fields the public case cards need. */
export function toPublicCases(records: CaseRecord[]): PublicCase[] {
  return records.map((c) => ({
    id: c.id,
    title: c.title,
    caseNumber: c.caseNumber,
    court: c.court,
    bench: c.bench,
    category: c.category,
    status: c.status,
    filedOn: c.filedOn,
    decidedOn: c.decidedOn,
    summary: c.summary,
    details: c.details,
    photos: c.photos,
  }));
}
