import { router, usePathname } from 'expo-router';
import { Bell, Compass, LayoutGrid, Radar, Rocket, Sparkles, UserRound } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useScreenInsets } from '@/hooks/useScreenInsets';

const TABS = [
  { id: 'explore', label: 'Explore', href: '/' },
  { id: 'missions', label: 'Missions', href: '/experiences' },
  { id: 'ai', label: 'AI Planner', href: '/ai-planner' },
  { id: 'tracker', label: 'Tracker', href: '/track' },
  { id: 'profile', label: 'Profile', href: '/account' },
] as const;

const MENU = [
  { label: 'Experiences', href: '/experiences' },
  { label: 'Book a Surprise', href: '/book/target' },
  { label: 'Join the Crew', href: '/crew/join' },
  { label: 'Scratch Reveal', href: '/reveal/demo' },
] as const;

type AppFrameProps = {
  children: ReactNode;
  wide?: boolean;
  hideTicker?: boolean;
};

export function AppFrame({ children, wide = false, hideTicker = false }: AppFrameProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useScreenInsets();
  const { phoneShell, wideShell } = useResponsive();
  const shellMax = wide ? wideShell : phoneShell;

  function tabActive(id: (typeof TABS)[number]['id']) {
    if (id === 'explore') {
      return pathname === '/';
    }
    if (id === 'missions') {
      return pathname.startsWith('/experiences') || pathname.startsWith('/create') || pathname.startsWith('/book');
    }
    if (id === 'ai') {
      return pathname.startsWith('/ai-planner');
    }
    if (id === 'tracker') {
      return pathname.startsWith('/track') || pathname.startsWith('/reveal');
    }
    return pathname.startsWith('/account') || pathname.startsWith('/admin') || pathname.startsWith('/surprise') || pathname.startsWith('/login');
  }

  function openTab(id: (typeof TABS)[number]['id'], href: string) {
    router.push(href as never);
  }

  function go(href: string) {
    setMenuOpen(false);
    router.push(href as never);
  }

  return (
    <AppScreen edges={['top']} maxWidth={shellMax} backgroundColor="#07070A">
      {hideTicker ? null : (
        <View style={styles.ticker}>
          <View style={styles.liveDot} />
          <Text numberOfLines={1} style={styles.tickerText}>
            Now Live in <Text style={styles.tickerStrong}>Hyderabad • Mumbai • Bangalore • Delhi</Text>
          </Text>
        </View>
      )}
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/')} style={styles.logo}>
          <Text style={styles.wordmark}>Surprise</Text>
          <View style={styles.logoDot} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/account')}
            style={styles.iconBtn}>
            <Bell color="#D4D4D8" size={18} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Menu"
            onPress={() => setMenuOpen(true)}
            style={styles.iconBtn}>
            <LayoutGrid color="#D4D4D8" size={18} />
          </Pressable>
        </View>
      </View>
      <View style={styles.body}>{children}</View>
      <View style={[styles.tabs, { paddingBottom: insets.padBottom }]}>
        {TABS.map((tab) => {
          const active = tabActive(tab.id);
          const color = active ? Colors.pink : '#A1A1AA';
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => openTab(tab.id, tab.href)}
              style={styles.tab}>
              <TabIcon active={active} id={tab.id} />
              <Text style={[styles.tabLabel, { color }, active && styles.tabLabelOn]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Modal transparent animationType="fade" visible={menuOpen} onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={[styles.overlay, { paddingTop: insets.padTop + 56 }]} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            {MENU.map((item) => (
              <Pressable key={item.href} accessibilityRole="button" onPress={() => go(item.href)} style={styles.menuLink}>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </Pressable>
            ))}
            {user ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setMenuOpen(false);
                  void logout().then(() => router.replace('/role'));
                }}
                style={styles.menuLink}>
                <Text style={styles.logout}>Log out</Text>
              </Pressable>
            ) : (
              <Pressable accessibilityRole="button" onPress={() => go('/login')} style={styles.menuLink}>
                <Text style={styles.menuLabel}>Log in</Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </AppScreen>
  );
}

function TabIcon({ id, active }: { id: (typeof TABS)[number]['id']; active: boolean }) {
  const color = active ? Colors.pink : '#A1A1AA';
  const size = 22;
  if (id === 'explore') {
    return <Compass color={color} size={size} />;
  }
  if (id === 'missions') {
    return <Rocket color={color} size={size} />;
  }
  if (id === 'ai') {
    return (
      <View>
        <Sparkles color={color} size={size} />
        <View style={styles.aiDot} />
      </View>
    );
  }
  if (id === 'tracker') {
    return <Radar color={color} size={size} />;
  }
  return <UserRound color={color} size={size} />;
}

const styles = StyleSheet.create({
  ticker: {
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1B1922',
    borderBottomWidth: 1,
    borderBottomColor: '#262430',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  tickerText: {
    color: '#A1A1AA',
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
  },
  tickerStrong: {
    color: '#E4E4E7',
  },
  header: {
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#25232D',
    backgroundColor: 'rgba(20, 19, 24, 0.94)',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordmark: {
    color: '#FFFFFF',
    fontFamily: Fonts.displayExtra,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.6,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.pink,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1C26',
    borderWidth: 1,
    borderColor: '#2E2A3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  tabs: {
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#262432',
    backgroundColor: 'rgba(20, 19, 24, 0.96)',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    alignItems: 'center',
    gap: 2,
    minWidth: 58,
  },
  tabLabel: {
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
  },
  tabLabelOn: {
    fontFamily: Fonts.ui,
  },
  aiDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.pink,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    marginHorizontal: 16,
    backgroundColor: '#1B1923',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2B2737',
    padding: 16,
  },
  menuLink: {
    minHeight: 44,
    justifyContent: 'center',
  },
  menuLabel: {
    color: Colors.snow,
    fontFamily: Fonts.ui,
    fontSize: 16,
  },
  logout: {
    color: Colors.pink,
    fontFamily: Fonts.ui,
    fontSize: 16,
  },
});
