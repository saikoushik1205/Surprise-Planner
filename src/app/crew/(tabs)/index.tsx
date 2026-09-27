import { router } from 'expo-router';
import { Clock, MapPin } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';
import { useAuth } from '@/context/AuthContext';
import { useCrewJobs } from '@/context/CrewJobsContext';
import { STATUS_CONFIG, TASK_CATEGORY_EMOJI } from '@/data/crewTasks';

export default function CrewHomeScreen() {
  const { user } = useAuth();
  const { stats, todayTasks, performance } = useCrewJobs();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = (user?.name ?? 'Rahul').split(' ')[0];
  const initials = (user?.name ?? 'Rahul Sharma')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const STATS = [
    { label: 'Assigned', value: stats.assigned, color: CrewColors.pink },
    { label: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
    { label: 'Completed', value: stats.completed, color: CrewColors.green },
    { label: 'Pending', value: stats.pending, color: CrewColors.muted },
  ];
  const PRIORITY = todayTasks[0];

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.greetBlock}>
          <Text style={styles.greet}>{greeting}, {firstName} 👋</Text>
          <Text style={styles.greetSub}>Here&apos;s what needs your attention today.</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Priority Task */}
      {PRIORITY ? (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Priority Task</Text>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          </View>
          <View style={styles.priorityCard}>
            <Text style={styles.priorityCat}>{PRIORITY.category.toUpperCase()} PICKUP</Text>
            <Text style={styles.priorityTitle}>{PRIORITY.title}</Text>
            <Text style={styles.priorityVenue}>{PRIORITY.location}</Text>
            <View style={styles.priorityMeta}>
              <Clock color={CrewColors.pink} size={13} />
              <Text style={styles.priorityMetaText}>{PRIORITY.time}</Text>
              <MapPin color={CrewColors.muted} size={13} />
              <Text style={styles.priorityMetaText}>{PRIORITY.location}</Text>
            </View>
            <View
              accessibilityRole="button"
              style={styles.viewTaskBtn}>
              <Text style={styles.viewTaskLabel}>View Task</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Upcoming today */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Upcoming Today</Text>
          <Text
            accessibilityRole="button"
            onPress={() => router.push('/crew/tasks' as never)}
            style={styles.viewAll}>
            View all →
          </Text>
        </View>
        <View style={styles.taskList}>
          {todayTasks.length === 0 ? (
            <Text style={styles.emptyHint}>No customer surprises assigned yet. Launch one from the customer app.</Text>
          ) : null}
          {todayTasks.slice(0, 4).map((task) => {
            const cfg = STATUS_CONFIG[task.status];
            return (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskAccent} />
                <View style={styles.taskIcon}>
                  <Text style={styles.taskEmoji}>{TASK_CATEGORY_EMOJI[task.category]}</Text>
                </View>
                <View style={styles.taskBody}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskSurprise}>{task.surprise}</Text>
                  <View style={styles.taskMeta}>
                    <Clock color={CrewColors.muted} size={11} />
                    <Text style={styles.taskMetaText}>{task.time}</Text>
                    <MapPin color={CrewColors.muted} size={11} />
                    <Text style={styles.taskMetaText} numberOfLines={1}>{task.location}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
                    <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Performance */}
      <View style={styles.perfCard}>
        <View>
          <Text style={styles.perfLabel}>Your performance</Text>
          <Text style={styles.perfRating}>
            <Text style={styles.perfBig}>{performance.rating}</Text>
            <Text style={styles.perfSmall}> / 5.0</Text>
          </Text>
        </View>
        <View style={styles.perfBadge}>
          <Text style={styles.perfBadgeText}>↗ {performance.completed} jobs done</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: CrewColors.bg },
  content: { paddingHorizontal: CrewSpace.screen, paddingTop: 16, paddingBottom: 16, gap: 20 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: CrewColors.pink,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontFamily: CrewFonts.display, fontSize: 16 },
  greetBlock: { flex: 1 },
  greet: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 17, lineHeight: 22 },
  greetSub: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13, lineHeight: 18, marginTop: 2 },
  emptyHint: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13, lineHeight: 18 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontFamily: CrewFonts.display, fontSize: 22, lineHeight: 26 },
  statLabel: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 10, textAlign: 'center' },

  // Section
  section: { gap: 12 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 17 },
  viewAll: { color: CrewColors.pink, fontFamily: CrewFonts.bodySemi, fontSize: 13 },
  urgentBadge: {
    backgroundColor: 'rgba(255,45,120,0.15)',
    borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(255,45,120,0.4)',
  },
  urgentText: { color: CrewColors.pink, fontFamily: CrewFonts.bodySemi, fontSize: 10, letterSpacing: 0.8 },

  // Priority card
  priorityCard: {
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    padding: CrewSpace.card,
    gap: 6,
    boxShadow: CrewShadow.card,
  },
  priorityCat: { color: CrewColors.pink, fontFamily: CrewFonts.bodySemi, fontSize: 11, letterSpacing: 0.8 },
  priorityTitle: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 20, lineHeight: 26 },
  priorityVenue: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 14 },
  priorityMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  priorityMetaText: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13 },
  viewTaskBtn: {
    marginTop: 8,
    backgroundColor: 'rgba(255,45,120,0.15)',
    borderRadius: CrewRadius.card,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,45,120,0.3)',
  },
  viewTaskLabel: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 15 },

  // Task list
  taskList: { gap: 10 },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    overflow: 'hidden',
    boxShadow: CrewShadow.card,
  },
  taskAccent: { width: 3, alignSelf: 'stretch', backgroundColor: CrewColors.pink },
  taskIcon: {
    width: 48, height: 48,
    margin: 12,
    backgroundColor: 'rgba(255,45,120,0.08)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  taskEmoji: { fontSize: 22 },
  taskBody: { flex: 1, paddingVertical: 12, paddingRight: 12, gap: 3 },
  taskTitle: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 14, lineHeight: 18 },
  taskSurprise: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 12 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  taskMetaText: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 11 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: CrewFonts.bodySemi, fontSize: 11 },

  // Performance
  perfCard: {
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    padding: CrewSpace.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: CrewShadow.card,
  },
  perfLabel: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13 },
  perfRating: { marginTop: 2 },
  perfBig: { color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 28 },
  perfSmall: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 16 },
  perfBadge: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  perfBadgeText: { color: CrewColors.green, fontFamily: CrewFonts.bodySemi, fontSize: 13 },
});
