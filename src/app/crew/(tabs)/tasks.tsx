import { Clock, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';
import {
  COMPLETED_TASKS,
  STATUS_CONFIG,
  TASK_CATEGORY_EMOJI,
  TODAY_TASKS,
  UPCOMING_TASKS,
  type CrewTask,
} from '@/data/crewTasks';

type Tab = 'today' | 'upcoming' | 'completed';

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: 'today', label: 'Today', count: TODAY_TASKS.length },
  { id: 'upcoming', label: 'Upcoming', count: UPCOMING_TASKS.length },
  { id: 'completed', label: 'Completed', count: COMPLETED_TASKS.length },
];

function getTasksForTab(tab: Tab): CrewTask[] {
  if (tab === 'today') return TODAY_TASKS;
  if (tab === 'upcoming') return UPCOMING_TASKS;
  return COMPLETED_TASKS;
}

export default function CrewTasksScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const tasks = getTasksForTab(activeTab);

  return (
    <View style={styles.page}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.subtitle}>Manage your pickups, setups, and deliveries.</Text>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
          style={styles.tabsScroll}>
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="button"
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabPill, active && styles.tabPillActive]}>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
                <View style={[styles.tabCount, active && styles.tabCountActive]}>
                  <Text style={[styles.tabCountText, active && styles.tabCountTextActive]}>
                    {tab.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Task list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyTitle}>All clear!</Text>
            <Text style={styles.emptyBody}>No tasks in this category right now.</Text>
          </View>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </ScrollView>
    </View>
  );
}

function TaskCard({ task }: { task: CrewTask }) {
  const cfg = STATUS_CONFIG[task.status];
  return (
    <View style={styles.card}>
      <View style={styles.cardAccent} />
      <View style={styles.iconBox}>
        <Text style={styles.iconEmoji}>{TASK_CATEGORY_EMOJI[task.category]}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{task.title}</Text>
        </View>
        <Text style={styles.cardSurprise}>{task.surprise}</Text>
        <View style={styles.metaRow}>
          <Clock color={CrewColors.muted} size={12} />
          <Text style={styles.metaText}>{task.date} • {task.time}</Text>
          <MapPin color={CrewColors.muted} size={12} />
          <Text style={styles.metaText} numberOfLines={1}>{task.location}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <View style={[styles.dot, { backgroundColor: cfg.color }]} />
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: CrewColors.bg },

  header: {
    paddingHorizontal: CrewSpace.screen,
    paddingBottom: 12,
    backgroundColor: CrewColors.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124,58,237,0.15)',
  },
  title: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 26, lineHeight: 32 },
  subtitle: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 14, marginTop: 2, marginBottom: 14 },

  tabsScroll: { marginHorizontal: -4 },
  tabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 4 },
  tabPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1,
    borderColor: CrewColors.border,
    backgroundColor: CrewColors.card,
  },
  tabPillActive: { backgroundColor: CrewColors.pink, borderColor: CrewColors.pink },
  tabLabel: { color: CrewColors.muted, fontFamily: CrewFonts.bodySemi, fontSize: 13 },
  tabLabelActive: { color: '#fff' },
  tabCount: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.2)',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabCountText: { color: CrewColors.muted, fontFamily: CrewFonts.bodySemi, fontSize: 11 },
  tabCountTextActive: { color: '#fff' },

  list: { flex: 1 },
  listContent: { paddingHorizontal: CrewSpace.screen, paddingTop: 16, gap: 12 },

  // Task card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    overflow: 'hidden',
    boxShadow: CrewShadow.card,
  },
  cardAccent: { width: 3, alignSelf: 'stretch', backgroundColor: CrewColors.pink },
  iconBox: {
    width: 48, height: 48,
    margin: 12,
    backgroundColor: 'rgba(255,45,120,0.08)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 22 },
  cardBody: { flex: 1, paddingVertical: 12, gap: 3 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 4 },
  cardTitle: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 14, lineHeight: 18, flex: 1 },
  cardSurprise: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, flexWrap: 'wrap' },
  metaText: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 11 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontFamily: CrewFonts.bodySemi, fontSize: 11 },
  chevron: { color: CrewColors.muted, fontSize: 22, alignSelf: 'center', paddingRight: 12 },

  empty: { marginTop: 60, alignItems: 'center', gap: 8 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 20 },
  emptyBody: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 14, textAlign: 'center' },
});
