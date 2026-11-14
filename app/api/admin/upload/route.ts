import { isAdmin } from '@/lib/auth';
import { UploadError, storeImage } from '@/lib/storage';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'No file was provided.' }, { status: 400 });

  try {
    return Response.json({ url: await storeImage(file) });
  } catch (err) {
    if (err instanceof UploadError) return Response.json({ error: err.message }, { status: 400 });
    console.error('Upload failed', err);
    return Response.json({ error: 'The upload could not be stored. Please try again.' }, { status: 500 });
  }
}
