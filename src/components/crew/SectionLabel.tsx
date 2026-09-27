import { StyleSheet, Text } from 'react-native';

import { CrewColors, CrewFonts } from '@/constants/crewTheme';

export function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.label}>{label}</Text>;
}

const styles = StyleSheet.create({
  label: {
    color: CrewColors.pink,
    fontFamily: CrewFonts.bodySemi,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
