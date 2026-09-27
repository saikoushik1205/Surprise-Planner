import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { AppScrollView } from '@/components/layout/AppScrollView';
import { CrewColors, CrewSpace } from '@/constants/crewTheme';

type CrewScreenProps = {
  children: ReactNode;
  back?: boolean;
  inTabs?: boolean;
};

export function CrewScreen({ children, back = false }: CrewScreenProps) {
  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/crew');
  }

  return (
    <AppScreen backgroundColor={CrewColors.bg}>
      <AppScrollView padded={false} contentContainerStyle={styles.content}>
        {back ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={styles.back}>
            <ChevronLeft size={24} color={CrewColors.text} />
          </Pressable>
        ) : null}
        {children}
      </AppScrollView>
    </AppScreen>
  );
}

export function CrewShell({ children }: { children: ReactNode }) {
  return (
    <AppScreen edges={['top']} backgroundColor={CrewColors.bg}>
      {children}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: CrewSpace.screen,
    paddingTop: 8,
    paddingBottom: 16,
  },
  back: {
    width: 48,
    height: 48,
    marginLeft: -12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
