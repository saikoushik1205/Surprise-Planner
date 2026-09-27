import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function BookLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.ink },
        animation: 'slide_from_right',
      }}
    />
  );
}
