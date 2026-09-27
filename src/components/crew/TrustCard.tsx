import { StyleSheet, Text, View } from 'react-native';

import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';

type TrustCardProps = {
  emoji: string;
  title: string;
  description: string;
};

export function TrustCard({ emoji, title, description }: TrustCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Text style={styles.emoji}>{emoji}</Text>
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
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: CrewColors.cardHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
    lineHeight: 30,
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
