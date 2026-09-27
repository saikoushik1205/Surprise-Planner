import type { Surprise, SurpriseInput, SurpriseStatus } from '@/types/surprise';

import { apiRequest } from './api';

type ApiSurprise = {
  id: string;
  title: string;
  recipientName: string;
  occasion: string;
  date: string;
  budget: number;
  description: string;
  status: string;
  city?: string;
  venue?: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  relationship?: string;
  createdAt: string;
};

const FROM_API_STATUS: Record<string, SurpriseStatus> = {
  draft: 'Draft',
  planned: 'Planned',
  'in-progress': 'Launched',
  launched: 'Launched',
  completed: 'Completed',
};

const TO_API_STATUS: Record<SurpriseStatus, string> = {
  Draft: 'planned',
  Planned: 'planned',
  Launched: 'in-progress',
  Completed: 'completed',
};

function toSurprise(item: ApiSurprise): Surprise {
  return {
    id: item.id,
    title: item.title,
    recipient: item.recipientName,
    occasion: item.occasion,
    date: item.date,
    budget: item.budget,
    description: item.description,
    status: FROM_API_STATUS[item.status] ?? 'Planned',
    createdAt: item.createdAt,
    city: item.city,
    venue: item.venue,
    landmark: item.landmark,
    lat: item.lat,
    lng: item.lng,
    relationship: item.relationship,
  };
}

function toApiInput(input: SurpriseInput) {
  return {
    title: input.title,
    recipientName: input.recipient,
    occasion: input.occasion,
    date: input.date,
    budget: input.budget,
    description: input.description,
    status: TO_API_STATUS[input.status],
    city: input.city,
    venue: input.venue,
    landmark: input.landmark,
    lat: input.lat,
    lng: input.lng,
    relationship: input.relationship,
  };
}

export const surpriseService = {
  async list(): Promise<Surprise[]> {
    const items = await apiRequest<ApiSurprise[]>('/surprises');
    return items.map(toSurprise);
  },

  async getById(id: string): Promise<Surprise | null> {
    try {
      const item = await apiRequest<ApiSurprise>(`/surprises/${id}`);
      return toSurprise(item);
    } catch (error) {
      if (error instanceof Error && error.message === 'Surprise not found.') {
        return null;
      }
      throw error;
    }
  },

  async create(input: SurpriseInput): Promise<Surprise> {
    const item = await apiRequest<ApiSurprise>('/surprises', {
      method: 'POST',
      body: JSON.stringify(toApiInput(input)),
    });
    return toSurprise(item);
  },

  async update(id: string, input: SurpriseInput): Promise<Surprise> {
    const item = await apiRequest<ApiSurprise>(`/surprises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toApiInput(input)),
    });
    return toSurprise(item);
  },

  async remove(id: string): Promise<void> {
    await apiRequest<{ message: string }>(`/surprises/${id}`, {
      method: 'DELETE',
    });
  },
};
