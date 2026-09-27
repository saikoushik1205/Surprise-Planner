import { router } from 'expo-router';
import { ArrowRight, Target } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Colors, Fonts } from '@/constants/theme';

export default function TrackerHomeScreen() {
  return (
    <AppFrame>
      <View style={styles.screen}>
        <View style={styles.center}>
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Target color={Colors.pink} size={36} />
            </View>
          </View>
          <Text style={styles.title}>No active missions</Text>
          <Text style={styles.copy}>Launch a surprise and track your crew in real time here.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create Surprise"
            onPress={() => router.push('/book/target')}
            style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
          >
            <Text style={styles.ctaLabel}>Create Surprise</Text>
            <ArrowRight color="#FFFFFF" size={18} />
          </Pressable>
        </View>
      </View>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.ink,
    overflow: 'hidden',
  },
  center: {
    alignItems: 'center',
  },
  iconRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255, 45, 120, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 45, 120, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.uiBold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  copy: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 22,
  },
  cta: {
    minHeight: 52,
    paddingHorizontal: 28,
    borderRadius: 16,
    backgroundColor: Colors.pink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    maxWidth: 320,
  },
  pressed: {
    opacity: 0.9,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.uiBold,
    fontSize: 16,
  },
});
