import { cache } from 'react';
import { asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { DEFAULT_DETAILS, DEFAULT_METRICS, FAVOURABLE, type Metrics, type SiteDetails } from './config';
import { getDb, usingNeon } from './db';
import { casePhotos, cases, consultations, settings } from './db/schema';
import type { CaseInput, CasePhoto } from './types';

export type CaseRecord = typeof cases.$inferSelect & { photos: CasePhoto[] };
export type Inquiry = typeof consultations.$inferSelect;

async function attachPhotos(rows: (typeof cases.$inferSelect)[]): Promise<CaseRecord[]> {
  if (rows.length === 0) return [];
  const db = await getDb();
  const photos = await db
    .select()
    .from(casePhotos)
    .where(inArray(casePhotos.caseId, rows.map((r) => r.id)))
    .orderBy(asc(casePhotos.position));
  const byCase = new Map<number, CasePhoto[]>();
  for (const p of photos) {
    const list = byCase.get(p.caseId) ?? [];
    list.push({ url: p.url, caption: p.caption });
    byCase.set(p.caseId, list);
  }
  return rows.map((r) => ({ ...r, photos: byCase.get(r.id) ?? [] }));
}

export async function listCases(): Promise<CaseRecord[]> {
  const db = await getDb();
  return attachPhotos(await db.select().from(cases).orderBy(desc(cases.id)));
}

export async function listLandmarkCases(): Promise<CaseRecord[]> {
  const db = await getDb();
  const rows = await db.select().from(cases).where(eq(cases.isLandmark, true)).orderBy(desc(cases.id));
  // Decided matters first (most recent decision first), then pending ones.
  rows.sort((a, b) => (b.decidedOn ?? '').localeCompare(a.decidedOn ?? ''));
  return attachPhotos(rows);
}

export async function getCase(id: number): Promise<CaseRecord | null> {
  const db = await getDb();
  const rows = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
  return (await attachPhotos(rows))[0] ?? null;
}

/** Inserts or updates a case and replaces its photo set. Returns the case id. */
export async function saveCase(input: CaseInput): Promise<number> {
  const db = await getDb();
  const values = {
    title: input.title,
    caseNumber: input.caseNumber,
    court: input.court,
    bench: input.bench,
    category: input.category,
    status: input.status,
    filedOn: input.filedOn || null,
    decidedOn: input.decidedOn || null,
    summary: input.summary,
    details: input.details,
    isLandmark: input.isLandmark,
  };

  const photoRows = (caseId: number) =>
    input.photos.map((p, position) => ({ caseId, url: p.url, caption: p.caption, position }));

  if (input.id) {
    const caseId = input.id;
    const update = db.update(cases).set({ ...values, updatedAt: new Date() }).where(eq(cases.id, caseId));
    const clearPhotos = db.delete(casePhotos).where(eq(casePhotos.caseId, caseId));
    const rows = photoRows(caseId);
    if (usingNeon) {
      // One request to Neon, applied as a single transaction: the case and its
      // photo set change together or not at all.
      if (rows.length) await db.batch([update, clearPhotos, db.insert(casePhotos).values(rows)]);
      else await db.batch([update, clearPhotos]);
    } else {
      await update;
      await clearPhotos;
      if (rows.length) await db.insert(casePhotos).values(rows);
    }
    return caseId;
  }

  const [row] = await db.insert(cases).values(values).returning({ id: cases.id });
  const rows = photoRows(row.id);
  if (rows.length) await db.insert(casePhotos).values(rows);
  return row.id;
}

/** Deletes a case; its photo rows go with it (ON DELETE CASCADE). */
export async function deleteCase(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(cases).where(eq(cases.id, id));
}

export function computeStats(all: CaseRecord[]) {
  const decided = all.filter((c) => c.status !== 'Pending');
  const favourable = decided.filter((c) => FAVOURABLE.includes(c.status));
  const byCourt = new Map<string, { total: number; active: number; favourable: number; decided: number }>();
  for (const c of all) {
    const row = byCourt.get(c.court) ?? { total: 0, active: 0, favourable: 0, decided: 0 };
    row.total += 1;
    if (c.status === 'Pending') row.active += 1;
    else row.decided += 1;
    if (FAVOURABLE.includes(c.status)) row.favourable += 1;
    byCourt.set(c.court, row);
  }
  return {
    total: all.length,
    active: all.length - decided.length,
    decided: decided.length,
    favourable: favourable.length,
    successRate: decided.length ? Math.round((favourable.length / decided.length) * 100) : null,
    landmark: all.filter((c) => c.isLandmark).length,
    byCourt: [...byCourt.entries()].map(([court, v]) => ({ court, ...v })),
  };
}

/** All stored settings as a key/value map, read once per request. */
const readSettings = cache(async (): Promise<Record<string, string>> => {
  const db = await getDb();
  const rows = await db.select({ key: settings.key, value: settings.value }).from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
});

async function writeSettings(entries: Record<string, string>): Promise<void> {
  const db = await getDb();
  await db
    .insert(settings)
    .values(Object.entries(entries).map(([key, value]) => ({ key, value })))
    .onConflictDoUpdate({ target: settings.key, set: { value: sql`excluded.value` } });
}

export async function getMetrics(): Promise<Metrics> {
  const stored = await readSettings();
  return {
    yearsExperience: stored.yearsExperience || DEFAULT_METRICS.yearsExperience,
    successRate: stored.successRate || DEFAULT_METRICS.successRate,
    casesResolved: stored.casesResolved || DEFAULT_METRICS.casesResolved,
  };
}

export async function saveMetrics(metrics: Metrics): Promise<void> {
  await writeSettings(metrics);
}

/** Site details are stored under "site.<field>" keys. */
export async function getSiteDetails(): Promise<SiteDetails> {
  const stored = await readSettings();
  const details = { ...DEFAULT_DETAILS };
  for (const key of Object.keys(DEFAULT_DETAILS) as (keyof SiteDetails)[]) {
    // A saved empty value (an optional field cleared in the admin) is kept as empty.
    if (stored[`site.${key}`] !== undefined) details[key] = stored[`site.${key}`];
  }
  return details;
}

export async function saveSiteDetails(details: SiteDetails): Promise<void> {
  await writeSettings(Object.fromEntries(Object.entries(details).map(([k, v]) => [`site.${k}`, v])));
}

export async function createInquiry(input: typeof consultations.$inferInsert): Promise<void> {
  const db = await getDb();
  await db.insert(consultations).values(input);
}

export async function listInquiries(): Promise<Inquiry[]> {
  const db = await getDb();
  return db.select().from(consultations).orderBy(desc(consultations.id));
}

export async function setInquiryStatus(id: number, status: string): Promise<void> {
  const db = await getDb();
  await db.update(consultations).set({ status }).where(eq(consultations.id, id));
}

export async function deleteInquiry(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(consultations).where(eq(consultations.id, id));
}
