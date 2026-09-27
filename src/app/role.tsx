import { router } from 'expo-router';
import { ArrowRight, Gift, Lock, Shield, Sparkles, Star, Users, Zap } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { AppScrollView } from '@/components/layout/AppScrollView';
import { Fonts } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import type { AuthRole } from '@/types/auth';

export default function RoleScreen() {
  const { height, phoneShell } = useResponsive();
  const allowScroll = height > 0 && height < 640;

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

  const body = (
    <>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Star color="#FF4992" size={10} fill="#FF4992" />
          <Text style={styles.heroBadgeText}>India&apos;s Surprise Network</Text>
        </View>
        <Text style={styles.headline}>Make Every Surprise Special</Text>
        <Text style={styles.sub}>Choose how you&apos;d like to use Surprise Planner.</Text>
      </View>

      <View style={styles.cards}>
        <View style={styles.customerCard}>
          <View pointerEvents="none" style={styles.glowPinkTop} />
          <View pointerEvents="none" style={styles.glowPinkCorner} />

          <View style={styles.cardHeader}>
            <View style={styles.iconRingPink}>
              <Gift color="#FF4992" size={20} />
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Most Popular</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Continue as Customer</Text>
          <Text style={styles.cardCopy}>
            Plan unforgettable surprises — birthday raids, romantic drops, Bollywood moments — delivered by a real crew.
          </Text>

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
            <ArrowRight color="#fff" size={16} />
          </Pressable>

          <Pressable accessibilityRole="button" onPress={() => openCustomer('login')} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              Already have an account?{'  '}
              <Text style={styles.switchLinkPink}>Sign In →</Text>
            </Text>
          </Pressable>
        </View>

        <View style={styles.crewCard}>
          <View pointerEvents="none" style={styles.glowVioletTop} />
          <View pointerEvents="none" style={styles.glowVioletCorner} />

          <View style={styles.cardHeader}>
            <View style={styles.iconRingViolet}>
              <Shield color="#a78bfa" size={20} />
            </View>
          </View>

          <Text style={styles.cardTitle}>Continue as Crew</Text>
          <Text style={styles.cardCopy}>
            Join our on-ground crew. Execute surprise missions, earn per job, and be part of something unforgettable.
          </Text>

          <View style={styles.statsRow}>
            <StatChip icon={<Users color="#a78bfa" size={11} />} label="120+ Members" />
            <StatChip icon={<Zap color="#a78bfa" size={11} />} label="6 Cities" />
            <StatChip icon={<Star color="#a78bfa" size={11} fill="#a78bfa" />} label="4.8 Rating" />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => openCrew('signup')}
            style={({ pressed }) => [styles.crewBtn, pressed && styles.pressed]}
          >
            <Shield color="#a78bfa" size={15} />
            <Text style={styles.crewBtnLabel}>Register as Crew</Text>
            <ArrowRight color="#a78bfa" size={15} />
          </Pressable>

          <Pressable accessibilityRole="button" onPress={() => openCrew('login')} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              Already a crew member?{'  '}
              <Text style={styles.switchLinkViolet}>Sign In →</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.trust}>
        <Lock color="#4B5563" size={11} />
        <Text style={styles.trustText}>Secured • Verified • Trusted across India</Text>
      </View>
    </>
  );

  return (
    <AppScreen backgroundColor="#050508" maxWidth={phoneShell}>
        <View style={styles.topBar}>
          <View style={styles.topLead}>
            <View style={styles.mark}>
              <Sparkles color="#fff" size={14} />
            </View>
            <Text style={styles.topTitle}>Surprise Planner</Text>
          </View>
          <View style={styles.liveChip}>
            <Zap color="#10B981" size={11} fill="#10B981" />
            <Text style={styles.liveText}>India Live</Text>
          </View>
        </View>

        {allowScroll ? (
          <AppScrollView padded={false} contentContainerStyle={styles.body}>
            {body}
          </AppScrollView>
        ) : (
          <View style={styles.body}>{body}</View>
        )}
    </AppScreen>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  topLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FF4992',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255,73,146,0.5)',
  },
  topTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.uiBold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  liveText: {
    color: '#10B981',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
    letterSpacing: 0.4,
  },

  body: {
    flexGrow: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    justifyContent: 'space-between',
    gap: 10,
  },

  hero: {
    alignItems: 'center',
    gap: 4,
    marginVertical: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,73,146,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,73,146,0.25)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
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
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    color: '#94A3B8',
    fontFamily: Fonts.jakarta,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },

  cards: {
    gap: 10,
  },
  customerCard: {
    backgroundColor: '#111220',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
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

  crewCard: {
    backgroundColor: '#0E0D1C',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
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

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconRingPink: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,73,146,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,73,146,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingViolet: {
    width: 36,
    height: 36,
    borderRadius: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardBadgeText: {
    color: '#FF4992',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.uiBold,
    fontSize: 16,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  cardCopy: {
    color: '#94A3B8',
    fontFamily: Fonts.jakarta,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },

  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 8,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillText: {
    color: '#CBD5E1',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  statChipText: {
    color: '#a78bfa',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },

  primaryBtn: {
    minHeight: 42,
    paddingVertical: 10,
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
    minHeight: 42,
    paddingVertical: 10,
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
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  switchText: {
    color: '#64748B',
    fontFamily: Fonts.jakarta,
    fontSize: 12,
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

  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 2,
    paddingBottom: 2,
  },
  trustText: {
    color: '#374151',
    fontFamily: Fonts.jakarta,
    fontSize: 11,
  },
});
