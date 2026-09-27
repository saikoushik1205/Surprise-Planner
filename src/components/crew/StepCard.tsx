import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';

type StepCardProps = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export function StepCard({ number, icon: Icon, title, description }: StepCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.number}>{number}</Text>
      <View style={styles.icon}>
        <Icon size={22} color={CrewColors.text} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    padding: CrewSpace.card,
    boxShadow: CrewShadow.card,
  },
  number: {
    color: CrewColors.pink,
    fontFamily: CrewFonts.display,
    fontSize: 28,
    lineHeight: 34,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: CrewColors.cardHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  title: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 18,
    lineHeight: 24,
    marginTop: 14,
  },
  description: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
});
