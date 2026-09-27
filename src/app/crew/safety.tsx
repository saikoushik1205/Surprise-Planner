import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CrewScreen } from '@/components/crew/CrewScreen';
import { PillButton } from '@/components/crew/PillButton';
import { SectionLabel } from '@/components/crew/SectionLabel';
import { TrustCard } from '@/components/crew/TrustCard';
import { CrewColors, CrewFonts, CrewSpace } from '@/constants/crewTheme';
import { CREW_TRUST } from '@/data/crewPortal';

export default function CrewSafetyScreen() {
  return (
    <CrewScreen back>
      <SectionLabel label="Trust & Safety" />
      <Text style={styles.title}>We keep everyone safe.</Text>

      <View style={styles.list}>
        {CREW_TRUST.map((item) => (
          <TrustCard key={item.title} {...item} />
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
