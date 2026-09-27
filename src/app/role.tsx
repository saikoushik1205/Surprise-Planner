import { router } from 'expo-router';
import { ArrowRight, Gift, Lock, Shield, Sparkles, Star, Users, Zap } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import type { AuthRole } from '@/types/auth';

export default function RoleScreen() {
  const { phoneShell } = useResponsive();

  function openCustomer(mode: 'login' | 'signup') {
    router.push({ pathname: mode === 'login' ? '/login' : '/signup', params: { role: 'customer' satisfies AuthRole } });
  }

  function openCrew(mode: 'login' | 'signup') {
    if (mode === 'signup') {
      router.push('/crew/apply' as never);
      return;
    }
    router.push({ pathname: '/login', params: { role: 'crew' satisfies AuthRole, next: '/crew' } });
  }

  return (
    <View style={styles.page}>
      <SafeAreaView style={[styles.shell, { maxWidth: phoneShell }]} edges={['top', 'left', 'right', 'bottom']}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.topLead}>
            <View style={styles.mark}>
              <Sparkles color="#fff" size={15} />
            </View>
            <Text style={styles.topTitle}>Surprise Planner</Text>
          </View>
          <View style={styles.liveChip}>
            <Zap color="#10B981" size={11} fill="#10B981" />
            <Text style={styles.liveText}>India Live</Text>
          </View>
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Star color="#FF4992" size={11} fill="#FF4992" />
              <Text style={styles.heroBadgeText}>India&apos;s Surprise Network</Text>
            </View>
            <Text style={styles.headline}>Make Every Surprise Special</Text>
            <Text style={styles.sub}>Choose how you&apos;d like to use Surprise Planner.</Text>
          </View>

          {/* Customer card */}
          <View style={styles.customerCard}>
            {/* Glow layers */}
            <View pointerEvents="none" style={styles.glowPinkTop} />
            <View pointerEvents="none" style={styles.glowPinkCorner} />

            {/* Header row */}
            <View style={styles.cardHeader}>
              <View style={styles.iconRingPink}>
                <Gift color="#FF4992" size={22} />
              </View>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Most Popular</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Continue as Customer</Text>
            <Text style={styles.cardCopy}>
              Plan unforgettable surprises — birthday raids, romantic drops, Bollywood moments — delivered by a real crew.
            </Text>

            {/* Feature pills */}
            <View style={styles.pills}>
              <Pill label="🎂 Cake Raids" />
              <Pill label="💐 Flower Drops" />
              <Pill label="🎬 Live Reveals" />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => openCustomer('signup')}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.primaryBtnLabel}>Sign Up as Customer</Text>
              <ArrowRight color="#fff" size={18} />
            </Pressable>

            <Pressable accessibilityRole="button" onPress={() => openCustomer('login')} style={styles.switchBtn}>
              <Text style={styles.switchText}>
                Already have an account?{'  '}
                <Text style={styles.switchLinkPink}>Sign In →</Text>
              </Text>
            </Pressable>
          </View>

          {/* Crew card */}
          <View style={styles.crewCard}>
            <View pointerEvents="none" style={styles.glowVioletTop} />
            <View pointerEvents="none" style={styles.glowVioletCorner} />

            <View style={styles.cardHeader}>
              <View style={styles.iconRingViolet}>
                <Shield color="#a78bfa" size={22} />
              </View>
            </View>

            <Text style={styles.cardTitle}>Continue as Crew</Text>
            <Text style={styles.cardCopy}>
              Join our on-ground crew. Execute surprise missions, earn per job, and be part of something unforgettable.
            </Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <StatChip icon={<Users color="#a78bfa" size={13} />} label="120+ Members" />
              <StatChip icon={<Zap color="#a78bfa" size={13} />} label="6 Cities" />
              <StatChip icon={<Star color="#a78bfa" size={13} fill="#a78bfa" />} label="4.8 Rating" />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => openCrew('signup')}
              style={({ pressed }) => [styles.crewBtn, pressed && styles.pressed]}
            >
              <Shield color="#a78bfa" size={16} />
              <Text style={styles.crewBtnLabel}>Register as Crew</Text>
              <ArrowRight color="#a78bfa" size={16} />
            </Pressable>

            <Pressable accessibilityRole="button" onPress={() => openCrew('login')} style={styles.switchBtn}>
              <Text style={styles.switchText}>
                Already a crew member?{'  '}
                <Text style={styles.switchLinkViolet}>Sign In →</Text>
              </Text>
            </Pressable>
          </View>

          {/* Trust row */}
          <View style={styles.trust}>
            <Lock color="#4B5563" size={11} />
            <Text style={styles.trustText}>Secured • Verified • Trusted across India</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.statChip}>
      {icon}
      <Text style={styles.statChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#050508',
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    width: '100%',
    backgroundColor: '#07070A',
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  topLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#FF4992',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255,73,146,0.5)',
  },
  topTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.uiBold,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveText: {
    color: '#10B981',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.4,
  },

  /* Body — fills remaining space, no scroll */
  body: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
    justifyContent: 'space-between',
  },

  /* Hero */
  hero: {
    alignItems: 'center',
    gap: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,73,146,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,73,146,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: {
    color: '#FF4992',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headline: {
    color: '#FFFFFF',
    fontFamily: Fonts.displayExtra,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    color: '#94A3B8',
    fontFamily: Fonts.jakarta,
    fontSize: 13,
    textAlign: 'center',
  },

  /* Customer card */
  customerCard: {
    backgroundColor: '#111220',
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,73,146,0.2)',
    boxShadow: '0 8px 40px rgba(255,45,120,0.18), 0 2px 8px rgba(0,0,0,0.6)',
  },
  glowPinkTop: {
    position: 'absolute',
    top: -30,
    left: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,73,146,0.12)',
  },
  glowPinkCorner: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,45,120,0.08)',
  },

  /* Crew card */
  crewCard: {
    backgroundColor: '#0E0D1C',
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
    boxShadow: '0 8px 40px rgba(124,58,237,0.2), 0 2px 8px rgba(0,0,0,0.6)',
  },
  glowVioletTop: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(124,58,237,0.14)',
  },
  glowVioletCorner: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(124,58,237,0.08)',
  },

  /* Shared card parts */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconRingPink: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,73,146,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,73,146,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingViolet: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(124,58,237,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    backgroundColor: 'rgba(255,73,146,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,73,146,0.3)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardBadgeText: {
    color: '#FF4992',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.uiBold,
    fontSize: 17,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardCopy: {
    color: '#94A3B8',
    fontFamily: Fonts.jakarta,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },

  /* Pills */
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  pillText: {
    color: '#CBD5E1',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 12,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  statChipText: {
    color: '#a78bfa',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },

  /* Buttons */
  primaryBtn: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#FF4992',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 6px 24px rgba(255,45,120,0.45)',
  },
  primaryBtnLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.uiBold,
    fontSize: 14,
    letterSpacing: -0.1,
  },
  crewBtn: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 20px rgba(124,58,237,0.2)',
  },
  crewBtnLabel: {
    color: '#a78bfa',
    fontFamily: Fonts.uiBold,
    fontSize: 14,
    letterSpacing: -0.1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  switchBtn: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  switchText: {
    color: '#64748B',
    fontFamily: Fonts.jakarta,
    fontSize: 13,
    textAlign: 'center',
  },
  switchLinkPink: {
    color: '#ffb1c6',
    fontFamily: Fonts.jakartaSemi,
  },
  switchLinkViolet: {
    color: '#c4b5fd',
    fontFamily: Fonts.jakartaSemi,
  },

  /* Trust */
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  trustText: {
    color: '#374151',
    fontFamily: Fonts.jakarta,
    fontSize: 11,
  },
});
