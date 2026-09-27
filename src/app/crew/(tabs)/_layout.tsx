import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';

import { BottomTabBar } from '@/components/crew/BottomTabBar';
import { CrewShell } from '@/components/crew/CrewScreen';
import { CrewColors } from '@/constants/crewTheme';
import { useAuth } from '@/context/AuthContext';
import { isApprovedCrew } from '@/types/auth';

export default function CrewTabsLayout() {
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (isApprovedCrew(user)) {
      return;
    }
    if (user?.role === 'crew') {
      router.replace('/crew/pending');
      return;
    }
    router.replace({ pathname: '/login', params: { role: 'crew', next: '/crew' } });
  }, [isReady, user]);

  if (!isApprovedCrew(user)) {
    return null;
  }

  return (
    <CrewShell>
      <Tabs
        tabBar={(props) => <BottomTabBar {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: CrewColors.bg } }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="surprises" options={{ title: 'Surprises' }} />
        <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </CrewShell>
  );
}
