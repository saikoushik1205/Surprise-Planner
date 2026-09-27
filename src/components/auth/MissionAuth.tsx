import { router } from 'expo-router';
import { Lock, UserRound, Zap } from 'lucide-react-native';
import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, Layout } from '@/constants/theme';
import type { AuthRole } from '@/types/auth';
import { useResponsive } from '@/hooks/useResponsive';

export const AuthNight = {
  page: '#07070A',
  base: '#0B0C12',
  card: '#141622',
  elevated: '#1D2032',
  text: '#FFFFFF',
  muted: '#94A3B8',
  subtle: '#64748B',
  coral: '#FF4B72',
  pink: '#FF2D8A',
  live: '#10B981',
  glass: 'rgba(255, 255, 255, 0.08)',
} as const;

type MissionAuthProps = {
  mode: 'login' | 'signup';
  next?: string;
  role?: AuthRole;
  children: ReactNode;
  footer?: ReactNode;
};

export function MissionAuth({ mode, next, role, children, footer }: MissionAuthProps) {
  const { phoneShell } = useResponsive();

  function go(href: '/login' | '/signup') {
    const params: Record<string, string> = {};
    if (next) {
      params.next = next;
    }
    if (role) {
      params.role = role;
    }
    if (Object.keys(params).length === 0) {
      router.replace(href);
      return;
    }
    router.replace({ pathname: href, params } as never);
  }

  return (
    <View style={styles.page}>
      <SafeAreaView style={[styles.shell, { maxWidth: phoneShell }]} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topBar}>
            <View style={styles.topCopy}>
              <Text style={styles.topTitle}>Surprise Planner</Text>
              <Text style={styles.topSub}>
                {role === 'crew' ? 'Crew' : role === 'customer' ? 'Customer' : mode === 'login' ? 'Login' : 'Sign up'}
              </Text>
            </View>
            <View style={styles.ssl}>
              <Lock color={AuthNight.live} size={12} />
              <Text style={styles.sslText}>SSL</Text>
            </View>
            <View style={styles.avatar}>
              <UserRound color="#650031" size={16} />
            </View>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View pointerEvents="none" style={styles.glowA} />
              <View pointerEvents="none" style={styles.glowB} />

              <View style={styles.cardHead}>
                <View style={styles.brand}>
                  <Text style={styles.wordmark}>Surprise</Text>
                  <View style={styles.pulse} />
                </View>
                <View style={styles.live}>
                  <Zap color={AuthNight.live} size={12} fill={AuthNight.live} />
                  <Text style={styles.liveText}>India Live</Text>
                </View>
              </View>

              <Text style={styles.eyebrow}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</Text>
              <Text style={styles.headline}>Plan unforgettable surprises.</Text>
              <Text style={styles.lede}>
                Log in or create an account to orchestrate secret moments and track surprise crews in real time.
              </Text>

              <View style={styles.tabs}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: mode === 'login' }}
                  onPress={() => go('/login')}
                  style={[styles.tab, mode === 'login' && styles.tabOn]}
                >
                  <Text style={[styles.tabLabel, mode === 'login' && styles.tabLabelOn]}>Log In</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: mode === 'signup' }}
                  onPress={() => go('/signup')}
                  style={[styles.tab, mode === 'signup' && styles.tabOn]}
                >
                  <Text style={[styles.tabLabel, mode === 'signup' && styles.tabLabelOn]}>Create Account</Text>
                </Pressable>
              </View>

              {children}
            </View>
            {footer}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: AuthNight.page,
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    width: '100%',
    backgroundColor: AuthNight.base,
    overflow: 'hidden',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#22202A',
    maxWidth: Layout.phone,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(20, 22, 34, 0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AuthNight.glass,
  },
  topCopy: {
    flex: 1,
    minWidth: 0,
  },
  topTitle: {
    color: AuthNight.text,
    fontFamily: Fonts.uiBold,
    fontSize: 16,
  },
  topSub: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  ssl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AuthNight.elevated,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  sslText: {
    color: AuthNight.live,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffb1c6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: AuthNight.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: AuthNight.glass,
  },
  glowA: {
    position: 'absolute',
    right: -40,
    top: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 45, 138, 0.16)',
  },
  glowB: {
    position: 'absolute',
    left: -30,
    top: 120,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(87, 27, 193, 0.18)',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    color: AuthNight.text,
    fontFamily: Fonts.uiBold,
    fontSize: 22,
    letterSpacing: -0.4,
  },
  pulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AuthNight.coral,
    shadowColor: AuthNight.coral,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AuthNight.elevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveText: {
    color: AuthNight.live,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  eyebrow: {
    color: AuthNight.coral,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headline: {
    color: AuthNight.text,
    fontFamily: Fonts.uiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  lede: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: AuthNight.elevated,
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabOn: {
    backgroundColor: AuthNight.card,
  },
  tabLabel: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 14,
  },
  tabLabelOn: {
    color: AuthNight.text,
  },
});
