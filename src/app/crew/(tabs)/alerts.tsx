import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';
import { MOCK_NOTIFICATIONS, type CrewNotification } from '@/data/crewTasks';

const NEW_NOTIFICATIONS = MOCK_NOTIFICATIONS.filter((n) => n.unread);
const EARLIER_NOTIFICATIONS = MOCK_NOTIFICATIONS.filter((n) => !n.unread);

export default function CrewAlertsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>{NEW_NOTIFICATIONS.length} unread notifications</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {NEW_NOTIFICATIONS.length > 0 ? (
          <Section label="NEW">
            {NEW_NOTIFICATIONS.map((n) => (
              <NotifCard key={n.id} notif={n} />
            ))}
          </Section>
        ) : null}

        {EARLIER_NOTIFICATIONS.length > 0 ? (
          <Section label="EARLIER">
            {EARLIER_NOTIFICATIONS.map((n) => (
              <NotifCard key={n.id} notif={n} />
            ))}
          </Section>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionCards}>{children}</View>
    </View>
  );
}

function NotifCard({ notif: n }: { notif: CrewNotification }) {
  return (
    <View style={[styles.card, n.unread && styles.cardUnread]}>
      <View style={styles.iconBox}>
        <Text style={styles.iconEmoji}>{n.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle} numberOfLines={2}>{n.title}</Text>
          {n.unread ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text style={styles.cardBody2} numberOfLines={3}>{n.body}</Text>
        <Text style={styles.cardTime}>{n.time}</Text>
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
  listContent: { paddingHorizontal: CrewSpace.screen, paddingTop: 16, paddingBottom: 24, gap: 20 },

  section: { gap: 10 },
  sectionLabel: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1,
  },
  sectionCards: { gap: 8 },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: CrewColors.card,
    borderRadius: CrewRadius.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    padding: CrewSpace.card,
    boxShadow: CrewShadow.card,
  },
  cardUnread: { borderColor: 'rgba(255,45,120,0.3)', backgroundColor: '#14101e' },

  iconBox: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124,58,237,0.12)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 20 },

  cardBody: { flex: 1, gap: 4 },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  cardTitle: { flex: 1, color: CrewColors.text, fontFamily: CrewFonts.display, fontSize: 14, lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: CrewColors.pink, marginTop: 3, flexShrink: 0 },
  cardBody2: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13, lineHeight: 18 },
  cardTime: { color: '#6b7280', fontFamily: CrewFonts.body, fontSize: 11 },
});
