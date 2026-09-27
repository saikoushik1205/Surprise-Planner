import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, StatusColors } from '@/constants/theme';
import type { SurpriseStatus } from '@/types/surprise';

type StatusBadgeProps = {
  status: SurpriseStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = StatusColors[status] ?? Colors.muted;

  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}66` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
