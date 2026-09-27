import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/AuthContext';
import { surpriseService } from '@/services/surpriseService';
import type { Surprise, SurpriseInput } from '@/types/surprise';

type SurpriseContextValue = {
  surprises: Surprise[];
  isHydrated: boolean;
  refresh: () => Promise<void>;
  getSurprise: (id: string) => Surprise | undefined;
  createSurprise: (input: SurpriseInput) => Promise<Surprise>;
  updateSurprise: (id: string, input: SurpriseInput) => Promise<Surprise>;
  deleteSurprise: (id: string) => Promise<void>;
};

const SurpriseContext = createContext<SurpriseContextValue | null>(null);

type SurpriseProviderProps = {
  children: ReactNode;
};

export function SurpriseProvider({ children }: SurpriseProviderProps) {
  const { user, isReady } = useAuth();
  const [surprises, setSurprises] = useState<Surprise[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSurprises([]);
      setIsHydrated(true);
      return;
    }

    const items = await surpriseService.list();
    setSurprises(items);
    setIsHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let cancelled = false;
    void Promise.resolve().then(async () => {
      try {
        await refresh();
      } catch {
        if (!cancelled) {
          setSurprises([]);
          setIsHydrated(true);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isReady, refresh]);

  const getSurprise = useCallback(
    (id: string) => surprises.find((item) => item.id === id),
    [surprises],
  );

  const createSurprise = useCallback(async (input: SurpriseInput) => {
    const created = await surpriseService.create(input);
    setSurprises((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    return created;
  }, []);

  const updateSurprise = useCallback(async (id: string, input: SurpriseInput) => {
    const updated = await surpriseService.update(id, input);
    setSurprises((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const deleteSurprise = useCallback(async (id: string) => {
    await surpriseService.remove(id);
    setSurprises((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      surprises,
      isHydrated,
      refresh,
      getSurprise,
      createSurprise,
      updateSurprise,
      deleteSurprise,
    }),
    [createSurprise, deleteSurprise, getSurprise, isHydrated, refresh, surprises, updateSurprise],
  );

  return <SurpriseContext.Provider value={value}>{children}</SurpriseContext.Provider>;
}

export function useSurprises(): SurpriseContextValue {
  const context = useContext(SurpriseContext);
  if (!context) {
    throw new Error('useSurprises must be used within SurpriseProvider.');
  }
  return context;
}
