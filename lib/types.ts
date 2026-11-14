export type CasePhoto = { url: string; caption: string };

export type CaseInput = {
  id?: number;
  title: string;
  caseNumber: string;
  court: string;
  bench: string;
  category: string;
  status: string;
  filedOn: string;
  decidedOn: string;
  summary: string;
  details: string;
  isLandmark: boolean;
  photos: CasePhoto[];
};

export type FormState = { error?: string; ok?: string } | null;
