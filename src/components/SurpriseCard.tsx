import { Calendar, IndianRupee, User } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { Surprise } from '@/types/surprise';
import { formatBudget, formatDate } from '@/utils/format';

type SurpriseCardProps = {
  surprise: Surprise;
  onPress: () => void;
};

export function SurpriseCard({ surprise, onPress }: SurpriseCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${surprise.title} for ${surprise.recipient}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.topRow}>
        <Text style={styles.occasion}>{surprise.occasion.toUpperCase()}</Text>
        <StatusBadge status={surprise.status} />
      </View>
      <Text style={styles.title}>{surprise.title}</Text>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <User color={Colors.muted} size={15} />
          <Text style={styles.metaText}>{surprise.recipient}</Text>
        </View>
        <View style={styles.meta}>
          <Calendar color={Colors.muted} size={15} />
          <Text style={styles.metaText}>{formatDate(surprise.date)}</Text>
        </View>
        <View style={styles.meta}>
          <IndianRupee color={Colors.muted} size={15} />
          <Text style={styles.metaText}>{formatBudget(surprise.budget)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.panel,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    gap: 10,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.995 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  occasion: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: Colors.muted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
});
