import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Pill } from '@/components/fit';
import { Colors, Fonts } from '@/constants/theme';

export default function ConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const surpriseId = id ?? 'demo';

  return (
    <AppFrame>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>Mission locked</Text>
        <Text style={styles.title}>The moment is on its way.</Text>
        <Text style={styles.sub}>You don&apos;t have to be there. We&apos;ll make them feel you were.</Text>
        <View style={styles.spacer} />
        <Pill label="Scratch reveal" onPress={() => router.push(`/reveal/${surpriseId}` as never)} />
        <Pill label="Live tracker" tone="ghost" onPress={() => router.push(`/track/${surpriseId}` as never)} />
        <Pill label="Back home" tone="ghost" onPress={() => router.replace('/')} />
      </View>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 8,
    gap: 10,
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
    fontFamily: Fonts.displayExtra,
    fontSize: 32,
    lineHeight: 36,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  spacer: {
    height: 12,
  },
});
