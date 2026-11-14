// Inserts the sample case records into the configured database.
// Usage: npm run db:seed
import { getDb, usingNeon } from '../lib/db';
import { cases } from '../lib/db/schema';
import { seedSampleData } from '../lib/db/seed';

async function main() {
  const db = await getDb();
  const existing = await db.select({ id: cases.id }).from(cases).limit(1);
  if (existing.length > 0) {
    console.log('The cases table already has records; nothing was inserted.');
    return;
  }
  const count = await seedSampleData(db);
  console.log(`Inserted ${count} sample cases into ${usingNeon ? 'Neon' : 'the local database'}.`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
