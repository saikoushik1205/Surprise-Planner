import { router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Calendar, IndianRupee, MapPin, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Banner } from '@/components/Banner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StatusBadge } from '@/components/StatusBadge';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useSurprises } from '@/context/SurpriseContext';
import { saveLaunch } from '@/data/liveSession';
import { surpriseService } from '@/services/surpriseService';
import type { Surprise } from '@/types/surprise';
import { formatBudget, formatDate } from '@/utils/format';

export default function SurpriseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSurprise, deleteSurprise, isHydrated, refresh } = useSurprises();
  const [surprise, setSurprise] = useState<Surprise | undefined>(id ? getSurprise(id) : undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(!surprise);

  useEffect(() => {
    if (!isHydrated) {
      void refresh();
    }
  }, [isHydrated, refresh]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) {
        setLoadError('Missing surprise id.');
        return;
      }
      const cached = getSurprise(id);
      if (cached) {
        setSurprise(cached);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetched = await surpriseService.getById(id);
        if (!cancelled) {
          setSurprise(fetched ?? undefined);
          setLoadError(fetched ? null : 'This surprise could not be found.');
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Could not load this surprise.');
          setIsLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [getSurprise, id]);

  async function confirmDelete() {
    if (!surprise) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteSurprise(surprise.id);
      router.replace('/account');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not delete this surprise.');
      setConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleReveal() {
    if (!surprise) {
      return;
    }
    saveLaunch(surprise.id, {
      recipientName: surprise.recipient,
      revealText: surprise.description,
    });
    router.push(`/reveal/${surprise.id}` as never);
  }

  return (
    <AppFrame>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {loadError ? <Banner tone="error" message={loadError} /> : null}

        {isLoading && !loadError ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Loading…</Text>
          </View>
        ) : null}

        {!isLoading && !surprise && !loadError ? (
          <EmptyState
            title="Surprise not found"
            message="This surprise may have been deleted or is unavailable."
            actionLabel="Go back"
            onAction={() => (router.canGoBack() ? router.back() : router.replace('/account'))}
          />
        ) : null}

        {surprise ? (
          <>
            {/* Occasion + status row */}
            <View style={styles.topRow}>
              <Text style={styles.occasion}>{surprise.occasion.toUpperCase()}</Text>
              <StatusBadge status={surprise.status} />
            </View>

            {/* Title */}
            <Text style={styles.title}>{surprise.title}</Text>

            {/* Meta card */}
            <View style={styles.metaCard}>
              <MetaRow icon={<User color={Colors.pink} size={16} />} label="For" value={surprise.recipient} />
              <RowDivider />
              <MetaRow
                icon={<Calendar color={Colors.muted} size={16} />}
                label="Date"
                value={formatDate(surprise.date)}
              />
              <RowDivider />
              <MetaRow
                icon={<MapPin color={Colors.muted} size={16} />}
                label="Location"
                value={[surprise.venue, surprise.landmark, surprise.city].filter(Boolean).join(' · ') || 'Location TBD'}
              />
              <RowDivider />
              <MetaRow
                icon={<IndianRupee color={Colors.success} size={16} />}
                label="Budget"
                value={formatBudget(surprise.budget)}
                valueColor={Colors.success}
              />
            </View>

            {/* Brief / description */}
            {surprise.description ? (
              <View style={styles.briefCard}>
                <Text style={styles.briefLabel}>Brief</Text>
                <Text style={styles.briefText}>{surprise.description}</Text>
              </View>
            ) : null}

            {/* Actions */}
            <View style={styles.actions}>
              <PrimaryButton label="Reveal the Surprise" onPress={handleReveal} />
              <View style={styles.actionRow}>
                <View style={styles.grow}>
                  <PrimaryButton
                    label="Edit"
                    variant="ghost"
                    onPress={() => router.push(`/surprise/${surprise.id}/edit` as never)}
                  />
                </View>
                <View style={styles.grow}>
                  <PrimaryButton
                    label="Track Live"
                    variant="ghost"
                    onPress={() => router.push(`/track/${surprise.id}` as never)}
                  />
                </View>
              </View>
              <PrimaryButton label="Delete" variant="danger" onPress={() => setConfirmOpen(true)} />
            </View>
          </>
        ) : null}

        <ConfirmDialog
          visible={confirmOpen}
          title="Delete this surprise?"
          message="This removes the brief from your account."
          confirmLabel="Delete"
          loading={isDeleting}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => void confirmDelete()}
        />
      </ScrollView>
    </AppFrame>
  );
}

function RowDivider() {
  return <View style={styles.divider} />;
}

function MetaRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaLeft}>
        {icon}
        <Text style={styles.metaLabel}>{label}</Text>
      </View>
      <Text style={[styles.metaValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  placeholder: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 15,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  occasion: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.displayExtra,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  metaCard: {
    backgroundColor: Colors.panel,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaLabel: {
    color: Colors.muted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
  },
  metaValue: {
    color: Colors.snow,
    fontFamily: Fonts.ui,
    fontSize: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  briefCard: {
    backgroundColor: Colors.panel,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  briefLabel: {
    color: Colors.muted,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  briefText: {
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  grow: {
    flex: 1,
  },
});
