import { apiRequest } from './api';

export type CrewAssignment = {
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

export const crewService = {
  async listAssigned(): Promise<CrewAssignment[]> {
    return apiRequest<CrewAssignment[]>('/crew/surprises');
  },
};
