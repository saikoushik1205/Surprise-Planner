import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Pill } from '@/components/fit';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';

const ORIGINS = ['USA', 'UK', 'Canada', 'Dubai', 'Singapore'] as const;

export default function NriScreen() {
  const { patchDraft } = usePlan();

  function start() {
    patchDraft({ occasion: 'anniversary', city: 'Hyderabad', step: 1 });
    router.push('/book/target');
  }

  return (
    <AppFrame>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>For Indians abroad</Text>
        <Text style={styles.title}>Miss them? Surprise them.</Text>
        <Text style={styles.body}>
          Send a real experience to family in India — cake, flowers, and your words — from wherever you live.
        </Text>
        <View style={styles.row}>
          {ORIGINS.map((origin) => (
            <View key={origin} style={styles.chip}>
              <Text style={styles.chipLabel}>{origin}</Text>
            </View>
          ))}
        </View>
        <View style={styles.stats}>
          <Stat value="₹500" label="friends can chip in" />
          <Stat value="6" label="cities live now" />
          <Stat value="1" label="crew at their door" />
        </View>
        <View style={styles.spacer} />
        <Pill label="Surprise someone in India" onPress={start} />
      </View>
    </AppFrame>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 12,
    paddingBottom: 8,
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.displayExtra,
    fontSize: 32,
    lineHeight: 36,
  },
  body: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipLabel: {
    color: Colors.snow,
    fontFamily: Fonts.uiMedium,
    fontSize: 13,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    gap: 4,
  },
  statValue: {
    color: Colors.pinkHot,
    fontFamily: Fonts.display,
    fontSize: 18,
  },
  statLabel: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
  },
  spacer: {
    flex: 1,
  },
});
