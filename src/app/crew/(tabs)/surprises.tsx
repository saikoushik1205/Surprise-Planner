import { Calendar, MapPin, Users } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';
import { MOCK_SURPRISES, STATUS_CONFIG, type CrewSurprise } from '@/data/crewTasks';

export default function CrewSurprisesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Surprises</Text>
        <Text style={styles.subtitle}>Surprises you&apos;re assigned to work on.</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {MOCK_SURPRISES.map((s) => (
          <SurpriseCard key={s.id} surprise={s} />
        ))}
      </ScrollView>
    </View>
  );
}

function SurpriseCard({ surprise: s }: { surprise: CrewSurprise }) {
  const progress = s.totalTasks > 0 ? s.doneTasks / s.totalTasks : 0;
  const isComplete = s.doneTasks === s.totalTasks;

  return (
    <View style={styles.card}>
      {/* Title row */}
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle} numberOfLines={1}>{s.title}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{s.category}</Text>
        </View>
      </View>

      {/* For */}
      <Text style={styles.forText}>For: {s.forName}</Text>

      {/* Meta */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar color={CrewColors.muted} size={13} />
          <Text style={styles.metaText}>{s.date} • {s.time}</Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin color={CrewColors.muted} size={13} />
          <Text style={styles.metaText} numberOfLines={1}>{s.venue}</Text>
        </View>
      </View>
      <View style={styles.metaItem}>
        <Users color={CrewColors.muted} size={13} />
        <Text style={styles.metaText}>{s.crewCount} crew</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHead}>
          <Text style={styles.progressLabel}>Your responsibilities</Text>
          <Text style={styles.progressCount}>{s.doneTasks} / {s.totalTasks}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` as `${number}%` },
              isComplete && styles.progressComplete,
            ]}
          />
        </View>
      </View>

      {/* Status badges */}
      <View style={styles.badgesRow}>
        {s.taskStatuses.map((status, i) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <View key={i} style={[styles.badge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          );
        })}
      </View>
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
  subtitle: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 14, marginTop: 2 },

  list: { flex: 1 },
  listContent: { paddingHorizontal: CrewSpace.screen, paddingTop: 16, paddingBottom: 24, gap: 14 },

  card: {
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    padding: CrewSpace.card,
    gap: 8,
    boxShadow: CrewShadow.card,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { flex: 1, color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 16, lineHeight: 20 },
  categoryBadge: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
  },
  categoryText: { color: '#a78bfa', fontFamily: CrewFonts.bodySemi, fontSize: 11 },

  forText: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13 },

  metaRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 12 },

  progressSection: { gap: 6, marginTop: 4 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 12 },
  progressCount: { color: CrewColors.muted, fontFamily: CrewFonts.bodySemi, fontSize: 12 },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: CrewColors.pink,
    borderRadius: 2,
  },
  progressComplete: { backgroundColor: CrewColors.green },

  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeText: { fontFamily: CrewFonts.bodySemi, fontSize: 11 },
});
