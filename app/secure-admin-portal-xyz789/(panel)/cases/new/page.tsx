import type { Metadata } from 'next';
import { CaseForm } from '@/components/admin/CaseForm';

export const metadata: Metadata = { title: 'Add case' };

export default function NewCasePage() {
  return <CaseForm heading="Add case" />;
}
