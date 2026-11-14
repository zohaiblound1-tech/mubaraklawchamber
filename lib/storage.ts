import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { del, put } from '@vercel/blob';

export class UploadError extends Error {}

const MAX_BYTES = 10 * 1024 * 1024;
/** Local fallback storage (no Blob token). Kept outside /public because a
 *  production server only serves public files that existed at build time;
 *  files here are served by app/uploads/[name]/route.ts instead. */
export const LOCAL_DIR = path.join(process.cwd(), '.local-uploads');
export const LOCAL_NAME = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

/** Determines the image type from the file's leading bytes, not its name. */
function sniff(bytes: Uint8Array): { ext: string; mime: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: 'jpg', mime: 'image/jpeg' };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return { ext: 'png', mime: 'image/png' };
  const tag = (from: number) => String.fromCharCode(...bytes.slice(from, from + 4));
  if (bytes.length > 12 && tag(0) === 'RIFF' && tag(8) === 'WEBP') return { ext: 'webp', mime: 'image/webp' };
  return null;
}

/** Stores an image in Vercel Blob (or ./public/uploads when no token is set)
 *  and returns its public URL. */
export async function storeImage(file: File): Promise<string> {
  if (file.size === 0) throw new UploadError('The file is empty.');
  if (file.size > MAX_BYTES) throw new UploadError('Photos must be 10 MB or smaller.');
  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buffer);
  if (!kind) throw new UploadError('Only JPEG, PNG or WebP photos can be uploaded.');
  const name = `${randomUUID()}.${kind.ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`cases/${name}`, buffer, { access: 'public', contentType: kind.mime });
    return blob.url;
  }
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_DIR, name), buffer);
  return `/uploads/${name}`;
}

/** URLs the CMS is allowed to save against a case. */
export function isAllowedPhotoUrl(url: string): boolean {
  if (url.startsWith('/uploads/')) return LOCAL_NAME.test(url.slice('/uploads/'.length));
  if (/^\/sample-doc\/[a-z]+$/.test(url)) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

/** Best-effort removal of a stored photo that is no longer referenced. */
export async function removeImage(url: string): Promise<void> {
  try {
    if (url.startsWith('/uploads/')) {
      const name = url.slice('/uploads/'.length);
      if (LOCAL_NAME.test(name)) await unlink(path.join(LOCAL_DIR, name));
    } else if (url.startsWith('https://') && isAllowedPhotoUrl(url) && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(url);
    }
  } catch {
    // The record is already updated; an orphaned file is not worth failing over.
  }
}
