import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PillButton } from '@/components/crew/PillButton';
import { CrewColors, CrewFonts, CrewGradients, CrewSpace } from '@/constants/crewTheme';
import { Layout } from '@/constants/theme';

export default function CrewJoinScreen() {
  const insets = useSafeAreaInsets();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/role');
  }

  return (
    <LinearGradient colors={CrewGradients.section} style={styles.page}>
      <View style={[styles.shell, { paddingTop: insets.top + 4, paddingBottom: insets.bottom + 32 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={styles.back}>
          <ChevronLeft size={24} color={CrewColors.text} />
        </Pressable>
        <View style={styles.body}>
          <Text style={styles.title}>Ready to join the crew?</Text>
          <Text style={styles.sub}>Takes 2 minutes. First order within 7 days.</Text>
        </View>
        <PillButton label="Apply Now →" variant="light" onPress={() => router.push('/crew/apply')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.phone,
    paddingHorizontal: CrewSpace.screen,
  },
  back: {
    width: 48,
    height: 48,
    marginLeft: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -0.8,
  },
  sub: {
    color: CrewColors.text,
    fontFamily: CrewFonts.body,
    fontSize: 17,
    lineHeight: 25,
    marginTop: 16,
    opacity: 0.9,
  },
});
