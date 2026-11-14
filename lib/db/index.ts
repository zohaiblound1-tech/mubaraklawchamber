import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { drizzle as drizzleNeon, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { cases } from './schema';
import { seedSampleData } from './seed';

export type DB = NeonHttpDatabase;

export const usingNeon = Boolean(process.env.DATABASE_URL);

// Idempotent DDL, mirrored from ./schema.ts. One statement per call because the
// Neon HTTP driver does not accept multi-statement queries.
const DDL = [
  sql`CREATE TABLE IF NOT EXISTS cases (
    id serial PRIMARY KEY,
    title text NOT NULL,
    case_number text NOT NULL,
    court text NOT NULL,
    bench text NOT NULL,
    category text NOT NULL,
    status text NOT NULL,
    filed_on date,
    decided_on date,
    summary text NOT NULL,
    details text NOT NULL DEFAULT '',
    is_landmark boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  sql`CREATE TABLE IF NOT EXISTS case_photos (
    id serial PRIMARY KEY,
    case_id integer NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    url text NOT NULL,
    caption text NOT NULL DEFAULT '',
    position integer NOT NULL DEFAULT 0
  )`,
  sql`CREATE INDEX IF NOT EXISTS case_photos_case_id_idx ON case_photos (case_id)`,
  sql`CREATE TABLE IF NOT EXISTS consultations (
    id serial PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL DEFAULT '',
    matter_type text NOT NULL DEFAULT '',
    preferred_date text NOT NULL DEFAULT '',
    message text NOT NULL,
    status text NOT NULL DEFAULT 'New',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  sql`CREATE TABLE IF NOT EXISTS settings (
    key text PRIMARY KEY,
    value text NOT NULL
  )`,
];

async function init(): Promise<DB> {
  let db: DB;
  if (process.env.DATABASE_URL) {
    db = drizzleNeon(neon(process.env.DATABASE_URL));
  } else {
    // No Neon connection string: run an embedded Postgres (PGlite) persisted to
    // ./.local-db so the app works out of the box in development.
    const { PGlite } = await import('@electric-sql/pglite');
    const { drizzle } = await import('drizzle-orm/pglite');
    const client = new PGlite(path.join(process.cwd(), '.local-db'));
    db = drizzle(client) as unknown as DB;
  }

  for (const statement of DDL) await db.execute(statement);

  // Sample records are only auto-inserted into the local development database.
  // For Neon, run `npm run db:seed` explicitly if you want them.
  if (!process.env.DATABASE_URL) {
    const existing = await db.select({ id: cases.id }).from(cases).limit(1);
    if (existing.length === 0) await seedSampleData(db);
  }
  return db;
}

const globalForDb = globalThis as unknown as { __mlcDb?: Promise<DB> };

export function getDb(): Promise<DB> {
  if (!globalForDb.__mlcDb) {
    globalForDb.__mlcDb = init().catch((err) => {
      globalForDb.__mlcDb = undefined;
      throw err;
    });
  }
  return globalForDb.__mlcDb;
}
