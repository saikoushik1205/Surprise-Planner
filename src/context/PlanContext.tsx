import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { shiftDate } from '@/data/booking';

export type PlanDraft = {
  step: number;
  occasion: string;
  recipientName: string;
  date: string;
  time: string;
  vibe: string;
  venue: string;
  addons: string[];
  cakeMessage: string;
  payMode: 'full' | 'half';
  revealText: string;
  city: string;
  group: boolean;
  relationship: string;
  crewTier: string;
  transport: string;
  treats: string[];
  skipTreats: boolean;
  loves: string;
  message: string;
  messageMode: 'card' | 'spoken';
  dateChoice: 'today' | 'tomorrow' | 'custom';
  slot: string;
  address: string;
  landmark: string;
  area: string;
  placeId: string;
  lat: number | null;
  lng: number | null;
  recipientPhone: string;
  secretDrop: boolean;
};

export type CrewProfile = {
  name: string;
  phone: string;
  city: string;
  role: string;
};

type PlanContextValue = {
  draft: PlanDraft;
  patchDraft: (partial: Partial<PlanDraft>) => void;
  resetDraft: () => void;
  crew: CrewProfile | null;
  saveCrew: (profile: CrewProfile) => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

function createDraft(): PlanDraft {
  return {
    step: 1,
    occasion: '',
    recipientName: '',
    date: shiftDate(1),
    time: '19:00',
    vibe: '',
    venue: '',
    addons: [],
    cakeMessage: '',
    payMode: 'full',
    revealText: '',
    city: 'Hyderabad',
    group: false,
    relationship: 'Partner',
    crewTier: '',
    transport: '',
    treats: [],
    skipTreats: false,
    loves: '',
    message: '',
    messageMode: 'card',
    dateChoice: 'tomorrow',
    slot: 'midnight',
    address: '',
    landmark: '',
    area: '',
    placeId: '',
    lat: null,
    lng: null,
    recipientPhone: '',
    secretDrop: true,
  };
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PlanDraft>(createDraft);
  const [crew, setCrew] = useState<CrewProfile | null>(null);

  const patchDraft = useCallback((partial: Partial<PlanDraft>) => {
    setDraft((current) => ({ ...current, ...partial }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(createDraft());
  }, []);

  const saveCrew = useCallback((profile: CrewProfile) => {
    setCrew(profile);
  }, []);

  const value = useMemo(
    () => ({ draft, patchDraft, resetDraft, crew, saveCrew }),
    [crew, draft, patchDraft, resetDraft, saveCrew],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within PlanProvider.');
  }
  return context;
}
