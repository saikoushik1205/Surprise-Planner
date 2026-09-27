import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { usePlan } from '@/context/PlanContext';
import { MISSION_OCCASION, MOOD_VIBE } from '@/data/planner';

export default function PlanScreen() {
  const params = useLocalSearchParams<{ mood?: string; mission?: string; type?: string }>();
  const { patchDraft } = usePlan();

  useEffect(() => {
    const occasion = params.mission ? MISSION_OCCASION[params.mission] : undefined;
    const vibe = params.mood ? MOOD_VIBE[params.mood] : undefined;
    patchDraft({
      ...(occasion ? { occasion } : {}),
      ...(vibe ? { vibe } : {}),
      ...(params.type === 'group' ? { group: true } : {}),
    });
  }, [params.mission, params.mood, params.type, patchDraft]);

  return <Redirect href="/book/target" />;
}
