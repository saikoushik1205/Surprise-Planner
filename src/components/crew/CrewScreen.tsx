import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrewColors, CrewSpace } from '@/constants/crewTheme';
import { useResponsive } from '@/hooks/useResponsive';

type CrewScreenProps = {
  children: ReactNode;
  back?: boolean;
  inTabs?: boolean;
};

export function CrewScreen({ children, back = false, inTabs = false }: CrewScreenProps) {
  const insets = useSafeAreaInsets();
  const { phoneShell } = useResponsive();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/crew');
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={[styles.scroll, { maxWidth: phoneShell }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (back ? 4 : 24), paddingBottom: inTabs ? 32 : insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}>
        {back ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={styles.back}>
            <ChevronLeft size={24} color={CrewColors.text} />
          </Pressable>
        ) : null}
        {children}
      </ScrollView>
    </View>
  );
}

export function CrewShell({ children }: { children: ReactNode }) {
  const { phoneShell } = useResponsive();
  return (
    <View style={styles.page}>
      <View style={[styles.shell, { maxWidth: phoneShell }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: CrewColors.bg,
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  content: {
    paddingHorizontal: CrewSpace.screen,
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
