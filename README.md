# Mubarak Law Chamber

Public portfolio site and unlisted admin CMS for Mubarak Law Chamber
(Rafiq Khan (PhD), Advocate High Court).

Next.js 15 (App Router) · Tailwind CSS v4 · Drizzle ORM · Neon PostgreSQL · Vercel Blob

## Run locally

```sh
npm install
npm run dev            # development, reloads on edits
# or: npm run build && npm run start   (production build, faster and stable)
```

- Public site: <http://localhost:3000>
- Admin CMS: <http://localhost:3000/secure-admin-portal-xyz789>
  (password is `ADMIN_PASSWORD` in `.env.local`)

## Environment (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string. Empty = embedded local Postgres in `./.local-db`, pre-filled with sample cases. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token. Empty = uploads are stored in `./.local-uploads` (local use only). |
| `ADMIN_PASSWORD` | Admin sign-in password. |
| `SESSION_SECRET` | 32+ character secret used to sign the session cookie. |

## Connecting Neon

This project is linked to a Neon project (see `.neon` and `neon.ts`).

1. `neon login`, then `neon deploy` (or `neon env pull`). This writes `DATABASE_URL` (pooled, used by the app)
   and `DATABASE_URL_UNPOOLED` (direct, used by `npm run db:push`) into `.env.local`.
2. Stop the local server, then `npm run db:copy-local` copies the local database (cases, photos, consultation
   requests, figures and site details) into Neon. It refuses to run if Neon already has cases or requests.
3. Rebuild and restart. Tables are created automatically on first request
   (`npm run db:push` does the same through drizzle-kit).
4. Optional, for an empty database instead: `npm run db:seed` inserts the sample cases.

## Admin portal

Sign in at `/secure-admin-portal-xyz789` with `ADMIN_PASSWORD`.

- **Cases**: add, edit (all fields and 4–5 photos) and delete; tick "Publish as a landmark case" to show it on the site.
- **Consultation requests**: mark as New / Contacted / Closed, or delete.
- **Site details**: principal, tagline, homepage introduction, About page text and qualifications, telephone,
  WhatsApp, email, address, hours and Facebook link.
- **Dashboard**: caseload figures and the public figures (years of practice, success rate, cases resolved).

## Structure

- `app/(site)/` — public pages sharing one header and footer: `/` (home), `/about`, `/practice`,
  `/track-record`, `/cases`, `/contact`
- `lib/content.ts` — main navigation and shared public content
- `app/secure-admin-portal-xyz789/` — admin CMS (dashboard, cases, consultation requests, sign-in)
- `app/api/admin/upload/` — authenticated photo upload endpoint
- `lib/db/` — Drizzle schema, connection and sample data
- `lib/actions.ts` — server actions (every admin action re-checks the session)
- `lib/config.ts` — courts, benches, categories, statuses, contact details, admin path
- `middleware.ts` — session gate for the admin route and admin API

## Changing the admin path

Rename the `app/secure-admin-portal-xyz789` folder, then update `ADMIN_PATH`
in `lib/config.ts` and the `matcher` in `middleware.ts` to match.

## Before going live

- Replace the sample cases, sample photos and the contact details in `lib/config.ts`.
- Replace the scales-and-gavel image with a licensed, unwatermarked copy. It is used as `public/images/scales-gavel.png` (hero), `public/images/scales-gavel-128.png` (logo marks), and `app/icon.png` / `app/apple-icon.png` (browser tab and phone home-screen icons). Keep the same file names and square proportions.
- Set the public figures (years, success rate, cases resolved) to numbers the chamber can substantiate.
- Set `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, a strong `ADMIN_PASSWORD` and `SESSION_SECRET` in the host's environment.
