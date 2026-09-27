import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CrewScreen } from '@/components/crew/CrewScreen';
import { PillButton } from '@/components/crew/PillButton';
import { SectionLabel } from '@/components/crew/SectionLabel';
import { StepCard } from '@/components/crew/StepCard';
import { CrewColors, CrewFonts, CrewSpace } from '@/constants/crewTheme';
import { CREW_STEPS } from '@/data/crewPortal';

export default function CrewHowItWorksScreen() {
  return (
    <CrewScreen back>
      <SectionLabel label="How It Works" />
      <Text style={styles.title}>Four steps to your first surprise.</Text>

      <View style={styles.list}>
        {CREW_STEPS.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </View>

      <View style={styles.actions}>
        <PillButton label="Join the Crew →" onPress={() => router.push('/crew/join')} />
      </View>
    </CrewScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  list: {
    marginTop: 24,
    gap: CrewSpace.cardGap,
  },
  actions: {
    marginTop: CrewSpace.section,
  },
});
