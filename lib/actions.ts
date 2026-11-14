'use server';

import { createHash, timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdmin } from './auth';
import {
  ADMIN_PATH,
  CATEGORIES,
  COURTS,
  DETAIL_FIELDS,
  INQUIRY_STATUSES,
  MAX_PHOTOS,
  MIN_PHOTOS,
  STATUSES,
  type SiteDetails,
} from './config';
import {
  createInquiry,
  deleteCase,
  deleteInquiry,
  getCase,
  saveCase,
  saveMetrics,
  saveSiteDetails,
  setInquiryStatus,
} from './data';
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, sessionConfigured } from './session';
import { isAllowedPhotoUrl, removeImage } from './storage';
import type { CaseInput, FormState } from './types';

const text = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const isDate = (v: string) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v);

/* ----------------------------- Authentication ----------------------------- */

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now > record.resetAt) attempts.delete(ip);
  else if (record && record.count >= MAX_ATTEMPTS) {
    return { error: 'Too many attempts. Try again in 15 minutes.' };
  }

  if (!sessionConfigured()) return { error: 'Admin access is not configured on this server.' };

  const digest = (s: string) => createHash('sha256').update(s).digest();
  const given = digest(String(formData.get('password') ?? ''));
  const expected = digest(process.env.ADMIN_PASSWORD as string);
  if (!timingSafeEqual(given, expected)) {
    const current = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
    current.count += 1;
    attempts.set(ip, current);
    return { error: 'Incorrect password.' };
  }

  attempts.delete(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  redirect(ADMIN_PATH);
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect(`${ADMIN_PATH}/login`);
}

/* --------------------------------- Cases ---------------------------------- */

export async function saveCaseAction(raw: CaseInput): Promise<FormState> {
  await requireAdmin();

  const input: CaseInput = {
    id: raw.id ? Number(raw.id) : undefined,
    title: text(raw.title, 200),
    caseNumber: text(raw.caseNumber, 80),
    court: text(raw.court, 80),
    bench: text(raw.bench, 80),
    category: text(raw.category, 80),
    status: text(raw.status, 40),
    filedOn: text(raw.filedOn, 10),
    decidedOn: text(raw.decidedOn, 10),
    summary: text(raw.summary, 600),
    details: text(raw.details, 8000),
    isLandmark: Boolean(raw.isLandmark),
    photos: (Array.isArray(raw.photos) ? raw.photos : []).map((p) => ({
      url: text(p?.url, 500),
      caption: text(p?.caption, 160),
    })),
  };

  if (!input.title || !input.caseNumber || !input.summary) {
    return { error: 'Title, case number and summary are required.' };
  }
  if (!COURTS[input.court]?.includes(input.bench)) return { error: 'Select a valid court and bench.' };
  if (!CATEGORIES.includes(input.category)) return { error: 'Select a valid category.' };
  if (!(STATUSES as readonly string[]).includes(input.status)) return { error: 'Select a valid status.' };
  if (!isDate(input.filedOn) || !isDate(input.decidedOn)) return { error: 'Dates must be valid.' };
  if (input.photos.length > MAX_PHOTOS) return { error: `A case can have at most ${MAX_PHOTOS} photos.` };
  if (input.photos.some((p) => !isAllowedPhotoUrl(p.url))) return { error: 'One of the photos is not valid.' };
  if (input.isLandmark && input.photos.length < MIN_PHOTOS) {
    return { error: `Landmark cases shown on the public site need ${MIN_PHOTOS} to ${MAX_PHOTOS} photos.` };
  }

  const previous = input.id ? await getCase(input.id) : null;
  if (input.id && !previous) return { error: 'This case no longer exists.' };

  await saveCase(input);

  const kept = new Set(input.photos.map((p) => p.url));
  for (const old of previous?.photos ?? []) {
    if (!kept.has(old.url)) await removeImage(old.url);
  }

  revalidatePath('/', 'layout');
  redirect(`${ADMIN_PATH}/cases`);
}

export async function deleteCaseAction(id: number): Promise<void> {
  await requireAdmin();
  const existing = await getCase(Number(id));
  if (existing) {
    await deleteCase(existing.id);
    for (const p of existing.photos) await removeImage(p.url);
  }
  revalidatePath('/', 'layout');
  redirect(`${ADMIN_PATH}/cases`);
}

/* -------------------------------- Settings -------------------------------- */

export async function saveMetricsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const metrics = {
    yearsExperience: text(formData.get('yearsExperience'), 12),
    successRate: text(formData.get('successRate'), 12),
    casesResolved: text(formData.get('casesResolved'), 12),
  };
  if (Object.values(metrics).some((v) => !v)) return { error: 'All three figures are required.' };
  await saveMetrics(metrics);
  revalidatePath('/', 'layout');
  return { ok: 'Public figures updated.' };
}

const PHONE = /^[+\d][\d\s()-]{6,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function saveSiteDetailsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const details = Object.fromEntries(
    DETAIL_FIELDS.map((f) => [f.key, text(formData.get(f.key), f.max)]),
  ) as SiteDetails;

  const missing = DETAIL_FIELDS.find((f) => !f.optional && !details[f.key]);
  if (missing) return { error: `${missing.label} is required.` };
  if (!PHONE.test(details.phone)) return { error: 'Enter a valid telephone number.' };
  if (!PHONE.test(details.whatsapp)) return { error: 'Enter a valid WhatsApp number.' };
  if (!EMAIL.test(details.email)) return { error: 'Enter a valid email address.' };
  try {
    if (new URL(details.facebook).protocol !== 'https:') throw new Error();
  } catch {
    return { error: 'The Facebook link must be a full address starting with https://' };
  }

  await saveSiteDetails(details);
  revalidatePath('/', 'layout');
  return { ok: 'Site details saved. The public site now shows them.' };
}

/* -------------------------------- Inquiries ------------------------------- */

export async function setInquiryStatusAction(id: number, status: string): Promise<void> {
  await requireAdmin();
  if (!(INQUIRY_STATUSES as readonly string[]).includes(status)) return;
  await setInquiryStatus(Number(id), status);
  revalidatePath(ADMIN_PATH, 'layout');
}

export async function deleteInquiryAction(id: number): Promise<void> {
  await requireAdmin();
  await deleteInquiry(Number(id));
  revalidatePath(ADMIN_PATH, 'layout');
}

/** Public consultation request form. */
export async function submitConsultationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real visitors never fill this hidden field.
  if (text(formData.get('company'), 100)) return { ok: 'Thank you. The chamber will contact you shortly.' };

  const input = {
    name: text(formData.get('name'), 120),
    phone: text(formData.get('phone'), 40),
    email: text(formData.get('email'), 160),
    matterType: text(formData.get('matterType'), 80),
    preferredDate: text(formData.get('preferredDate'), 10),
    message: text(formData.get('message'), 3000),
  };
  if (!input.name || !input.phone || !input.message) {
    return { error: 'Please provide your name, phone number and a brief description of the matter.' };
  }
  if (!PHONE.test(input.phone)) return { error: 'Please enter a valid phone number.' };
  if (input.email && !EMAIL.test(input.email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!isDate(input.preferredDate)) return { error: 'Please enter a valid preferred date.' };

  await createInquiry(input);
  return { ok: 'Thank you. Your request has been received and the chamber will contact you shortly.' };
}
