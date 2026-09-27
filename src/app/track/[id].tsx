import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Pill } from '@/components/fit';
import { Colors, Fonts } from '@/constants/theme';
import { getTrackStep, setTrackStep } from '@/data/liveSession';
import { TRACK_STEPS } from '@/data/planner';

export default function TrackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trackId = id ?? 'demo';
  const [step, setStep] = useState(() => getTrackStep(trackId));
  const current = TRACK_STEPS.find((item) => item.id === step) ?? TRACK_STEPS[0];

  function advance() {
    const next = step >= TRACK_STEPS.length ? 1 : step + 1;
    setTrackStep(trackId, next);
    setStep(next);
  }

  return (
    <AppFrame>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>Day-of live execution</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.detail}>{current.detail}</Text>
        <View style={styles.list}>
          {TRACK_STEPS.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={[styles.dot, item.id <= step && styles.dotOn]} />
              <Text style={[styles.rowLabel, item.id === step && styles.rowOn]}>{item.title}</Text>
            </View>
          ))}
        </View>
        <Pill label={step >= TRACK_STEPS.length ? 'Replay' : 'Advance crew'} onPress={advance} />
      </View>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 8,
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
    fontFamily: Fonts.display,
    fontSize: 26,
    lineHeight: 30,
  },
  detail: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  dotOn: {
    backgroundColor: Colors.pink,
  },
  rowLabel: {
    color: Colors.muted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
  },
  rowOn: {
    color: Colors.snow,
    fontFamily: Fonts.ui,
  },
});
