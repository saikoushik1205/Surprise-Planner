import { router } from 'expo-router';
import { Clock3, Shield } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';

export default function CrewPendingScreen() {
  return (
    <AppScreen backgroundColor={CrewColors.bg}>
      <View style={styles.body}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Shield color={CrewColors.pink} size={18} fill="rgba(255,45,120,0.15)" />
          </View>
          <View>
            <Text style={styles.brandName}>Surprise Planner</Text>
            <Text style={styles.brandSub}>Crew Registration</Text>
          </View>
        </View>

        <View style={styles.iconWrap}>
          <Clock3 color={CrewColors.pink} size={36} />
        </View>

        <Text style={styles.title}>Registration Submitted</Text>
        <Text style={styles.bodyCopy}>
          Thanks for registering as a Crew member. We&apos;ve received your details and our team will review your
          registration.
        </Text>
        <Text style={styles.soon}>We&apos;ll get back to you soon.</Text>

        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusLabel}>Status: Under Review</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/role')}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <Text style={styles.ctaLabel}>Back to Home</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: CrewSpace.screen,
    gap: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,45,120,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,120,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 14,
  },
  brandSub: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 11,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,45,120,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
  },
  title: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  bodyCopy: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  soon: {
    color: CrewColors.pink,
    fontFamily: CrewFonts.bodySemi,
    fontSize: 15,
    textAlign: 'center',
  },
  status: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: CrewColors.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    borderRadius: CrewRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  statusLabel: {
    color: CrewColors.text,
    fontFamily: CrewFonts.bodySemi,
    fontSize: 13,
  },
  cta: {
    marginTop: 10,
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: CrewColors.pink,
    borderRadius: CrewRadius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    boxShadow: CrewShadow.cta,
  },
  ctaLabel: {
    color: '#fff',
    fontFamily: CrewFonts.display,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.85,
  },
});
