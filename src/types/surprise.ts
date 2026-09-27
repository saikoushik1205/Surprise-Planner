export const SURPRISE_STATUSES = ['Draft', 'Planned', 'Launched', 'Completed'] as const;

export type SurpriseStatus = (typeof SURPRISE_STATUSES)[number];

export type Surprise = {
  id: string;
  title: string;
  recipient: string;
  occasion: string;
  date: string;
  budget: number;
  description: string;
  status: SurpriseStatus;
  createdAt: string;
  city?: string;
  venue?: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  relationship?: string;
};

export type SurpriseDraft = {
  title: string;
  recipient: string;
  occasion: string;
  date: string;
  budget: string;
  description: string;
  status: SurpriseStatus;
  city?: string;
  venue?: string;
  landmark?: string;
  relationship?: string;
};

export type SurpriseInput = {
  title: string;
  recipient: string;
  occasion: string;
  date: string;
  budget: number;
  description: string;
  status: SurpriseStatus;
  city?: string;
  venue?: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  relationship?: string;
};
