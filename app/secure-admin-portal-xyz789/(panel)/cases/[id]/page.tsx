import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseForm } from '@/components/admin/CaseForm';
import { getCase } from '@/lib/data';

export const metadata: Metadata = { title: 'Edit case' };

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = /^\d+$/.test(id) ? await getCase(Number(id)) : null;
  if (!record) notFound();

  return (
    <CaseForm
      heading="Edit case"
      initial={{
        id: record.id,
        title: record.title,
        caseNumber: record.caseNumber,
        court: record.court,
        bench: record.bench,
        category: record.category,
        status: record.status,
        filedOn: record.filedOn ?? '',
        decidedOn: record.decidedOn ?? '',
        summary: record.summary,
        details: record.details,
        isLandmark: record.isLandmark,
        photos: record.photos,
      }}
    />
  );
}
