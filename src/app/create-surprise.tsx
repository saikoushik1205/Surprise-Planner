import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { usePlan } from '@/context/PlanContext';
import { MISSION_OCCASION } from '@/data/planner';

export default function CreateSurpriseScreen() {
  const { mission } = useLocalSearchParams<{ mission?: string }>();
  const { patchDraft } = usePlan();

  useEffect(() => {
    const occasion = mission ? MISSION_OCCASION[mission] : undefined;
    if (occasion) {
      patchDraft({ occasion });
    }
  }, [mission, patchDraft]);

  return <Redirect href="/book/target" />;
}
