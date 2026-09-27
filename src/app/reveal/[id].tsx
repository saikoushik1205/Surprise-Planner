import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Pill } from '@/components/fit';
import { Colors, Fonts } from '@/constants/theme';
import { getReveal } from '@/data/liveSession';

export default function RevealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reveal = getReveal(id ?? 'demo');
  const [scratches, setScratches] = useState(0);
  const open = scratches >= 4;

  return (
    <AppFrame>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>Digital surprise reveal</Text>
        <Text style={styles.title}>{open ? reveal.revealText : 'Scratch to reveal'}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scratch the card"
          onPress={() => setScratches((current) => Math.min(4, current + 1))}
          style={styles.card}>
          <View style={[styles.cover, { opacity: open ? 0 : 1 - scratches * 0.22 }]} />
          <Text style={styles.for}>For {reveal.recipientName}</Text>
          <Text style={styles.hint}>{open ? 'They can see it.' : 'Tap the card to scratch'}</Text>
        </Pressable>
        <Pill label="Live tracker" tone="ghost" onPress={() => router.push(`/track/${id ?? 'demo'}` as never)} />
      </View>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 12,
    paddingBottom: 8,
    justifyContent: 'center',
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
    lineHeight: 32,
  },
  card: {
    flex: 1,
    maxHeight: 280,
    borderRadius: 24,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 6,
  },
  cover: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.pink,
  },
  for: {
    color: Colors.snow,
    fontFamily: Fonts.ui,
    fontSize: 16,
  },
  hint: {
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
});
