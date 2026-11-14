import type { DB } from './index';
import { casePhotos, cases } from './schema';

// SAMPLE DATA ONLY. These records are illustrative placeholders so the site and
// CMS can be tested. Replace them with the chamber's real matters before launch.

const samplePhotos = [
  { url: '/sample-doc/judgment', caption: 'Judgment excerpt (sample image)' },
  { url: '/sample-doc/seal', caption: 'Court seal (sample image)' },
  { url: '/sample-doc/petition', caption: 'Petition filing (sample image)' },
  { url: '/sample-doc/order', caption: 'Order sheet (sample image)' },
  { url: '/sample-doc/causelist', caption: 'Cause list entry (sample image)' },
];

const sampleCases: (typeof cases.$inferInsert & { photoCount: number })[] = [
  {
    title: 'Textile Exporter v. Federal Board of Revenue',
    caseNumber: 'W.P. No. 0000/2022',
    court: 'Lahore High Court',
    bench: 'Principal Seat, Lahore',
    category: 'Constitutional Writ Petition (Art. 199)',
    status: 'Allowed',
    filedOn: '2022-03-14',
    decidedOn: '2023-01-19',
    summary:
      'Constitutional petition under Article 199 challenging a recovery notice issued without a show-cause hearing. Notice set aside for want of due process.',
    details:
      'The petitioner, an export-oriented textile unit, was served with a recovery notice attaching its bank accounts without any prior show-cause notice or opportunity of hearing.\n\nThe petition was argued on the ground that the action violated Articles 4 and 10-A of the Constitution and the principle of audi alteram partem. The Court held that coercive recovery without adjudication was without lawful authority, set aside the notice and directed de-attachment of the accounts.',
    isLandmark: true,
    photoCount: 5,
  },
  {
    title: 'Government Employee v. Federation of Pakistan',
    caseNumber: 'W.P. No. 0000/2021',
    court: 'Islamabad High Court',
    bench: 'Islamabad',
    category: 'Constitutional Writ Petition (Art. 199)',
    status: 'Allowed',
    filedOn: '2021-06-02',
    decidedOn: '2022-04-27',
    summary:
      'Writ against termination from service passed without regular inquiry. Order declared void; reinstatement with back benefits directed.',
    details:
      'The petitioner was removed from service through a non-speaking order, with the regular inquiry dispensed with and no reasons recorded.\n\nThe Court found that dispensing with an inquiry where disputed facts exist offends the settled law on fair trial, declared the impugned order to be of no legal effect and directed reinstatement with all consequential benefits.',
    isLandmark: true,
    photoCount: 4,
  },
  {
    title: 'The State v. Accused (Criminal Appeal)',
    caseNumber: 'Crl. A. No. 0000/2020',
    court: 'Lahore High Court',
    bench: 'Rawalpindi Bench',
    category: 'Criminal (CrPC, 1898)',
    status: 'Acquittal',
    filedOn: '2020-09-21',
    decidedOn: '2022-11-08',
    summary:
      'Appeal under Section 410 CrPC against conviction. Conviction set aside on material contradictions in the prosecution evidence; appellant acquitted.',
    details:
      'The appellant had been convicted by the trial court principally on the testimony of two related witnesses.\n\nOn appeal it was demonstrated that the ocular account was irreconcilable with the medical evidence and that the recovery was not proved in accordance with Section 103 CrPC. Extending the benefit of doubt, the Court set aside the conviction and ordered the appellant’s release.',
    isLandmark: true,
    photoCount: 5,
  },
  {
    title: 'Landowner v. Development Authority',
    caseNumber: 'R.F.A. No. 0000/2019',
    court: 'Lahore High Court',
    bench: 'Multan Bench',
    category: 'Civil (CPC, 1908)',
    status: 'Allowed',
    filedOn: '2019-02-11',
    decidedOn: '2021-10-05',
    summary:
      'Regular first appeal under Section 96 CPC in a suit for declaration and possession. Decree of the trial court reversed; title of the appellant affirmed.',
    details:
      'The trial court had dismissed the suit after misreading the revenue record and ignoring registered title documents.\n\nIn appeal the Court re-appraised the evidence under Order XLI Rule 31 CPC, held that the registered sale deed carried a presumption of correctness that had not been rebutted, and decreed the suit.',
    isLandmark: true,
    photoCount: 4,
  },
  {
    title: 'Shipping Company v. Port Authority',
    caseNumber: 'C.P. No. D-0000/2023',
    court: 'Sindh High Court',
    bench: 'Principal Seat, Karachi',
    category: 'Constitutional Writ Petition (Art. 199)',
    status: 'Pending',
    filedOn: '2023-08-30',
    decidedOn: null,
    summary:
      'Constitutional petition challenging the retrospective levy of port storage charges. Interim relief granted; matter fixed for final hearing.',
    details:
      'The petitioner challenges a notification imposing enhanced storage charges with retrospective effect.\n\nAt the preliminary hearing the Court issued notice to the respondents and restrained coercive recovery subject to the petitioner furnishing security with the Nazir of the Court.',
    isLandmark: true,
    photoCount: 4,
  },
  {
    title: 'Borrower v. Commercial Bank',
    caseNumber: 'C.O.S. No. 0000/2022',
    court: 'Lahore High Court',
    bench: 'Principal Seat, Lahore',
    category: 'Banking & Commercial',
    status: 'Settled',
    filedOn: '2022-01-17',
    decidedOn: '2022-12-12',
    summary: 'Recovery suit resolved through a court-recorded compromise under Order XXIII Rule 3 CPC.',
    details: '',
    isLandmark: false,
    photoCount: 0,
  },
  {
    title: 'Applicant v. The State (Bail)',
    caseNumber: 'Crl. Misc. No. 0000-B/2024',
    court: 'Lahore High Court',
    bench: 'Bahawalpur Bench',
    category: 'Criminal (CrPC, 1898)',
    status: 'Pending',
    filedOn: '2024-05-06',
    decidedOn: null,
    summary: 'Post-arrest bail application under Section 497 CrPC; case of further inquiry pleaded.',
    details: '',
    isLandmark: false,
    photoCount: 0,
  },
  {
    title: 'Contractor v. Province of Sindh',
    caseNumber: 'Suit No. 0000/2018',
    court: 'Sindh High Court',
    bench: 'Sukkur Bench',
    category: 'Civil (CPC, 1908)',
    status: 'Dismissed',
    filedOn: '2018-07-23',
    decidedOn: '2020-03-02',
    summary: 'Suit for recovery of contractual dues dismissed as barred by limitation.',
    details: '',
    isLandmark: false,
    photoCount: 0,
  },
];

export async function seedSampleData(db: DB): Promise<number> {
  for (const { photoCount, ...record } of sampleCases) {
    const [row] = await db.insert(cases).values(record).returning({ id: cases.id });
    if (photoCount > 0) {
      await db.insert(casePhotos).values(
        samplePhotos.slice(0, photoCount).map((p, position) => ({ ...p, caseId: row.id, position })),
      );
    }
  }
  return sampleCases.length;
}
