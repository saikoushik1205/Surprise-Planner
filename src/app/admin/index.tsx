import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Pill } from '@/components/fit';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useSurprises } from '@/context/SurpriseContext';
import { SURPRISE_STATUSES } from '@/types/surprise';

export default function AdminScreen() {
  const { user } = useAuth();
  const { surprises } = useSurprises();
  const [index, setIndex] = useState(0);
  const current = surprises[index];

  if (!user) {
    return (
      <AppFrame>
        <View style={styles.screen}>
          <Text style={styles.title}>Admin</Text>
          <Text style={styles.sub}>Log in to see your surprise orders.</Text>
          <View style={styles.spacer} />
          <Pill label="Log in" onPress={() => router.push({ pathname: '/login', params: { next: '/admin' } })} />
        </View>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>Admin</Text>
        <Text style={styles.title}>{surprises.length} orders</Text>
        <View style={styles.stats}>
          {SURPRISE_STATUSES.map((status) => (
            <View key={status} style={styles.stat}>
              <Text style={styles.statValue}>{surprises.filter((item) => item.status === status).length}</Text>
              <Text style={styles.statLabel}>{status}</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          {current ? (
            <Pressable accessibilityRole="button" onPress={() => router.push(`/surprise/${current.id}` as never)}>
              <Text style={styles.cardTitle}>{current.title}</Text>
              <Text style={styles.sub}>
                {current.recipient} · {current.status}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.sub}>No orders yet. Launch one from Plan.</Text>
          )}
        </View>
        {surprises.length > 1 ? (
          <View style={styles.row}>
            <View style={styles.grow}>
              <Pill
                label="Prev"
                tone="ghost"
                onPress={() => setIndex((value) => (value - 1 + surprises.length) % surprises.length)}
              />
            </View>
            <View style={styles.grow}>
              <Pill label="Next" tone="ghost" onPress={() => setIndex((value) => (value + 1) % surprises.length)} />
            </View>
          </View>
        ) : null}
        <View style={styles.spacer} />
      </View>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 10,
    paddingBottom: 8,
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.display,
    fontSize: 28,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    gap: 6,
  },
  stat: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.snow,
    fontFamily: Fonts.display,
    fontSize: 18,
  },
  statLabel: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    backgroundColor: Colors.raised,
  },
  cardTitle: {
    color: Colors.snow,
    fontFamily: Fonts.ui,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  grow: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
});
