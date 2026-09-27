import { Slot } from 'expo-router';

import { AppFrame } from '@/components/AppFrame';

export default function ExperiencesLayout() {
  return (
    <AppFrame wide>
      <Slot />
    </AppFrame>
  );
}
