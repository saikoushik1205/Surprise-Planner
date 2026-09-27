import { router } from 'expo-router';
import {
  Bell,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock,
  CreditCard,
  LogOut,
  Settings,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';
import { CREW_PERFORMANCE } from '@/data/crewTasks';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';

export default function CrewProfileScreen() {
  const { user, logout } = useAuth();
  const { crew } = usePlan();
  const insets = useSafeAreaInsets();

  const name = crew?.name ?? user?.name ?? 'Rahul Sharma';
  const email = user?.email ?? 'rahul.s@surpriseplanner.com';
  const phone = crew?.phone ?? '+91 98765 43210';
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  function handleLogout() {
    void logout().then(() => router.replace('/role'));
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}>

      {/* Profile header */}
      <View style={[styles.profileHeader, { paddingTop: insets.top + 20 }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard icon="⭐" value={String(CREW_PERFORMANCE.rating)} label="Rating" color="#f59e0b" />
        <StatCard icon="💼" value={String(CREW_PERFORMANCE.totalJobs)} label="Total Jobs" color={CrewColors.muted} />
        <StatCard icon="🏆" value={String(CREW_PERFORMANCE.completed)} label="Completed" color={CrewColors.green} />
      </View>

      {/* Crew ID card */}
      <View style={styles.crewIdCard}>
        <IdField label="CREW ID" value={CREW_PERFORMANCE.crewId} />
        <IdField label="JOINED" value={CREW_PERFORMANCE.joinedDate} />
        <IdField label="CITY" value={CREW_PERFORMANCE.city} />
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        <MenuItem
          icon={<ClipboardList color={CrewColors.muted} size={20} />}
          label="My Tasks"
          onPress={() => router.push('/crew/tasks' as never)}
        />
        <MenuItem
          icon={<Clock color={CrewColors.muted} size={20} />}
          label="Work History"
          onPress={() => Alert.alert('Work History', 'Coming soon.')}
        />
        <MenuItem
          icon={<Bell color={CrewColors.muted} size={20} />}
          label="Notifications"
          onPress={() => router.push('/crew/alerts' as never)}
        />
        <MenuItem
          icon={<CreditCard color={CrewColors.muted} size={20} />}
          label="Payment Details"
          onPress={() => Alert.alert('Payment Details', 'Coming soon.')}
        />
        <MenuItem
          icon={<CircleHelp color={CrewColors.muted} size={20} />}
          label="Help & Support"
          onPress={() => router.push('/crew/safety' as never)}
        />
        <MenuItem
          icon={<Settings color={CrewColors.muted} size={20} />}
          label="Settings"
          onPress={() => Alert.alert('Settings', 'Coming soon.')}
          last
        />
      </View>

      {/* Log out */}
      <Pressable
        accessibilityRole="button"
        onPress={handleLogout}
        style={({ pressed }) => [styles.logoutCard, pressed && styles.pressed]}>
        <LogOut color={CrewColors.pink} size={20} />
        <Text style={styles.logoutLabel}>Logout</Text>
      </Pressable>

      {/* Footer */}
      <Text style={styles.footer}>Surprise Planner Crew • v1.0.0</Text>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function IdField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.idField}>
      <Text style={styles.idLabel}>{label}</Text>
      <Text style={styles.idValue}>{value}</Text>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  last,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, !last && styles.menuItemBorder, pressed && styles.pressed]}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight color={CrewColors.muted} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: CrewColors.bg },
  content: { gap: 16 },

  // Profile header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: CrewSpace.screen,
    paddingBottom: 20,
    backgroundColor: '#0e0e1a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124,58,237,0.2)',
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: CrewColors.pink,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: '#fff', fontFamily: CrewFonts.display, fontSize: 22 },
  profileInfo: { flex: 1, gap: 2 },
  name: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 20, lineHeight: 26 },
  email: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13 },
  phone: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: CrewSpace.screen,
  },
  statCard: {
    flex: 1,
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    padding: 12,
    alignItems: 'center',
    gap: 2,
    boxShadow: CrewShadow.card,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontFamily: CrewFonts.display, fontSize: 20, lineHeight: 26 },
  statLabel: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 10, textAlign: 'center' },

  // Crew ID
  crewIdCard: {
    marginHorizontal: CrewSpace.screen,
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    paddingVertical: 14,
    paddingHorizontal: CrewSpace.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    boxShadow: CrewShadow.card,
  },
  idField: { alignItems: 'center', gap: 4 },
  idLabel: { color: CrewColors.muted, fontFamily: CrewFonts.bodySemi, fontSize: 10, letterSpacing: 0.8 },
  idValue: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 14 },

  // Menu
  menuCard: {
    marginHorizontal: CrewSpace.screen,
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    overflow: 'hidden',
    boxShadow: CrewShadow.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: CrewSpace.card,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124,58,237,0.15)',
  },
  menuIcon: { width: 24, alignItems: 'center' },
  menuLabel: { flex: 1, color: CrewColors.text, fontFamily: CrewFonts.body, fontSize: 15 },

  // Logout
  logoutCard: {
    marginHorizontal: CrewSpace.screen,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    backgroundColor: 'rgba(255,45,120,0.08)',
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,45,120,0.25)',
    paddingHorizontal: CrewSpace.card,
  },
  logoutLabel: { color: CrewColors.pink, fontFamily: CrewFonts.display, fontSize: 16 },

  footer: {
    color: '#4b5563',
    fontFamily: CrewFonts.body,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 4,
  },

  pressed: { opacity: 0.75 },
});
