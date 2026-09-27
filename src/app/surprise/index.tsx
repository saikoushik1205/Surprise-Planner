import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { EmptyState } from '@/components/EmptyState';
import { SurpriseCard } from '@/components/SurpriseCard';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useSurprises } from '@/context/SurpriseContext';

export default function MySurprisesScreen() {
  const { surprises, isHydrated, refresh } = useSurprises();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <AppFrame hideTicker>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Text style={styles.title}>My Surprises</Text>
          <Text style={styles.sub}>Missions you launched. Open one to track, reveal, or edit.</Text>
        </View>

        {!isHydrated ? <Text style={styles.loading}>Loading…</Text> : null}

        {isHydrated && surprises.length === 0 ? (
          <EmptyState
            title="No surprises yet"
            message="Launch a booking and it will show up here."
            actionLabel="Create Surprise"
            onAction={() => router.push('/book/target')}
          />
        ) : null}

        {surprises.map((surprise) => (
          <SurpriseCard
            key={surprise.id}
            surprise={surprise}
            onPress={() => router.push(`/surprise/${surprise.id}` as never)}
          />
        ))}
      </ScrollView>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  head: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.displayExtra,
    fontSize: 24,
    lineHeight: 30,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  loading: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
});
