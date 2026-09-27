import { router } from 'expo-router';
import { Bell, Gift, LogOut, MapPin, Palette } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';

export default function AccountScreen() {
  const { user, logout } = useAuth();
  const { draft } = usePlan();

  if (!user) {
    return null;
  }

  const displayName = user.name.trim() || 'Surprise';
  const initial = displayName.charAt(0).toUpperCase();

  function handleLogout() {
    void logout().then(() => router.replace('/role'));
  }

  return (
    <AppFrame hideTicker>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Centered avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Menu — each item is its own separate card */}
        <View style={styles.menu}>
          <MenuItem
            icon={<Bell color="#ffffff" size={20} />}
            label="Notifications"
            onPress={() => Alert.alert('Notifications', "You're all caught up.")}
          />
          <MenuItem
            icon={<Palette color="#F5C16C" size={20} />}
            label="Appearance"
            onPress={() => Alert.alert('Appearance', 'Midnight theme is on.')}
          />
          <MenuItem
            icon={<MapPin color={Colors.pink} size={20} />}
            label="My City"
            hint={draft.city}
            onPress={() => router.push('/')}
          />
          <MenuItem
            icon={<Gift color="#5EEAD4" size={20} />}
            label="My Surprises"
            onPress={() => router.push('/book/target')}
          />

          {/* Log out — pink text */}
          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <LogOut color={Colors.pink} size={20} />
            <Text style={styles.logoutLabel}>Log out</Text>
          </Pressable>

        </View>
      </ScrollView>
    </AppFrame>
  );
}

function MenuItem({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardIcon}>{icon}</View>
      <Text style={styles.cardLabel}>{label}</Text>
      {hint ? <Text style={styles.cardHint}>{hint}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.pink,
    backgroundColor: '#1a1928',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarInitial: {
    color: Colors.snow,
    fontFamily: Fonts.displayExtra,
    fontSize: 38,
    lineHeight: 46,
  },
  name: {
    color: Colors.snow,
    fontFamily: Fonts.uiBold,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  email: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  menu: {
    gap: Spacing.sm,
  },
  card: {
    minHeight: 56,
    backgroundColor: Colors.panel,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  cardIcon: {
    width: 28,
    alignItems: 'center',
  },
  cardLabel: {
    flex: 1,
    color: Colors.snow,
    fontFamily: Fonts.ui,
    fontSize: 16,
  },
  cardHint: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  logoutLabel: {
    flex: 1,
    color: Colors.pink,
    fontFamily: Fonts.ui,
    fontSize: 16,
  },
  closeCard: {
    justifyContent: 'center',
    borderColor: Colors.border,
  },
  closeLabel: {
    color: Colors.muted,
    fontFamily: Fonts.ui,
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
