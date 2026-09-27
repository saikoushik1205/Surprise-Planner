import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/crew/PillButton';
import { AppScreen } from '@/components/layout/AppScreen';
import { CrewColors, CrewFonts, CrewGradients, CrewSpace } from '@/constants/crewTheme';

export default function CrewJoinScreen() {
  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/role');
  }

  return (
    <AppScreen edges={['top', 'bottom']} backgroundColor={CrewColors.pink} maxWidth={null}>
      <LinearGradient colors={CrewGradients.section} style={styles.page}>
        <View style={styles.shell}>
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
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    paddingHorizontal: CrewSpace.screen,
    paddingBottom: 8,
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
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.8,
    width: '100%',
    flexShrink: 1,
  },
  sub: {
    color: CrewColors.text,
    fontFamily: CrewFonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 12,
    opacity: 0.9,
    width: '100%',
  },
});
