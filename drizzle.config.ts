import { defineConfig } from 'drizzle-kit';

// drizzle-kit does not read .env.local on its own.
try {
  process.loadEnvFile('.env.local');
} catch {
  // No .env.local: rely on the environment.
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  // Schema changes use Neon's direct connection; the app itself uses the pooled DATABASE_URL.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '' },
});
