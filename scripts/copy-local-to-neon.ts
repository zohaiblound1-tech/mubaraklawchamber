// One-time copy of the local development database (./.local-db) into Neon:
// cases, case photos, consultation requests and settings (public figures and
// site details). Record ids are kept, so photos stay attached to their cases.
//
// Usage: stop the local server first (the local database allows one process
// at a time), then run `npm run db:copy-local`.
//
// It refuses to copy when Neon already holds cases or consultation requests,
// so running it twice never duplicates records.
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';
import { getDb, usingNeon } from '../lib/db';
import { casePhotos, cases, consultations, settings } from '../lib/db/schema';

type LocalCase = {
  id: number;
  title: string;
  case_number: string;
  court: string;
  bench: string;
  category: string;
  status: string;
  filed_on: string | null;
  decided_on: string | null;
  summary: string;
  details: string;
  is_landmark: boolean;
  created_at: Date;
  updated_at: Date;
};
type LocalPhoto = { id: number; case_id: number; url: string; caption: string; position: number };
type LocalInquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  matter_type: string;
  preferred_date: string;
  message: string;
  status: string;
  created_at: Date;
};
type LocalSetting = { key: string; value: string };

async function main() {
  if (!usingNeon) {
    throw new Error('DATABASE_URL is empty in .env.local, so there is no Neon database to copy into.');
  }

  // getDb() also creates any missing tables in Neon.
  const db = await getDb();
  const [hasCases, hasInquiries] = await Promise.all([
    db.select({ id: cases.id }).from(cases).limit(1),
    db.select({ id: consultations.id }).from(consultations).limit(1),
  ]);
  if (hasCases.length || hasInquiries.length) {
    console.log('Neon already has cases or consultation requests. Nothing was copied, so nothing is duplicated.');
    return;
  }

  const local = new PGlite(path.join(process.cwd(), '.local-db'));
  const rows = async <T>(query: string) => (await local.query<T>(query)).rows;
  const localCases = await rows<LocalCase>(
    `SELECT id, title, case_number, court, bench, category, status, filed_on::text AS filed_on,
            decided_on::text AS decided_on, summary, details, is_landmark, created_at, updated_at
       FROM cases ORDER BY id`,
  );
  const localPhotos = await rows<LocalPhoto>(`SELECT id, case_id, url, caption, position FROM case_photos ORDER BY id`);
  const localInquiries = await rows<LocalInquiry>(
    `SELECT id, name, phone, email, matter_type, preferred_date, message, status, created_at
       FROM consultations ORDER BY id`,
  );
  const localSettings = await rows<LocalSetting>(`SELECT key, value FROM settings ORDER BY key`);
  await local.close();

  const writes = [];
  if (localCases.length) {
    writes.push(
      db.insert(cases).values(
        localCases.map((c) => ({
          id: c.id,
          title: c.title,
          caseNumber: c.case_number,
          court: c.court,
          bench: c.bench,
          category: c.category,
          status: c.status,
          filedOn: c.filed_on,
          decidedOn: c.decided_on,
          summary: c.summary,
          details: c.details,
          isLandmark: c.is_landmark,
          createdAt: new Date(c.created_at),
          updatedAt: new Date(c.updated_at),
        })),
      ),
    );
  }
  if (localPhotos.length) {
    writes.push(
      db.insert(casePhotos).values(
        localPhotos.map((p) => ({ id: p.id, caseId: p.case_id, url: p.url, caption: p.caption, position: p.position })),
      ),
    );
  }
  if (localInquiries.length) {
    writes.push(
      db.insert(consultations).values(
        localInquiries.map((i) => ({
          id: i.id,
          name: i.name,
          phone: i.phone,
          email: i.email,
          matterType: i.matter_type,
          preferredDate: i.preferred_date,
          message: i.message,
          status: i.status,
          createdAt: new Date(i.created_at),
        })),
      ),
    );
  }
  if (localSettings.length) {
    writes.push(
      db
        .insert(settings)
        .values(localSettings)
        .onConflictDoUpdate({ target: settings.key, set: { value: sql`excluded.value` } }),
    );
  }
  // Ids were copied explicitly, so move each id counter past them; otherwise
  // the next case or request added in the admin would collide with a copied id.
  for (const table of ['cases', 'case_photos', 'consultations']) {
    writes.push(
      db.execute(
        sql.raw(
          `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1, false)`,
        ),
      ),
    );
  }

  // All of it in one transaction: either everything is copied or nothing is.
  const [first, ...rest] = writes;
  await db.batch([first, ...rest]);

  console.log(
    `Copied into Neon: ${localCases.length} cases, ${localPhotos.length} case photos, ` +
      `${localInquiries.length} consultation requests, ${localSettings.length} settings.`,
  );
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  },
);
