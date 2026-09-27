import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Banner } from '@/components/Banner';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useSurprises } from '@/context/SurpriseContext';
import { surpriseService } from '@/services/surpriseService';
import { SURPRISE_STATUSES, type Surprise, type SurpriseStatus } from '@/types/surprise';

export default function EditSurpriseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSurprise, updateSurprise, isHydrated, refresh } = useSurprises();
  const [surprise, setSurprise] = useState<Surprise | undefined>();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<SurpriseStatus>('Planned');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      void refresh();
    }
  }, [isHydrated, refresh]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) {
        setError('Missing surprise id.');
        return;
      }
      const cached = getSurprise(id);
      const next = cached ?? (await surpriseService.getById(id));
      if (cancelled) {
        return;
      }
      if (!next) {
        setError('This surprise could not be found.');
        return;
      }
      setSurprise(next);
      setTitle(next.title);
      setDate(next.date);
      setBudget(String(next.budget));
      setStatus(next.status);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [getSurprise, id]);

  async function save() {
    if (!surprise) {
      return;
    }
    const amount = Number(budget);
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError('Date must be in YYYY-MM-DD format.');
      return;
    }
    if (!Number.isFinite(amount) || amount < 0) {
      setError('Enter a valid budget amount.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await updateSurprise(surprise.id, {
        title: title.trim(),
        recipient: surprise.recipient,
        occasion: surprise.occasion,
        date,
        budget: amount,
        description: surprise.description,
        status,
        city: surprise.city,
        relationship: surprise.relationship,
      });
      router.replace(`/surprise/${surprise.id}` as never);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save changes.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppFrame>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>Edit</Text>
          <Text style={styles.pageTitle}>Update your brief</Text>
        </View>

        {error ? <Banner tone="error" message={error} /> : null}

        {/* Form */}
        <View style={styles.form}>
          <FormField
            label="Title"
            placeholder="Surprise title"
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              setError(null);
            }}
            autoCapitalize="sentences"
            returnKeyType="next"
            required
          />

          <View style={styles.row}>
            <View style={styles.grow}>
              <FormField
                label="Date (YYYY-MM-DD)"
                placeholder="2026-12-25"
                value={date}
                onChangeText={(v) => {
                  setDate(v);
                  setError(null);
                }}
                keyboardType="numbers-and-punctuation"
                returnKeyType="next"
              />
            </View>
            <View style={styles.grow}>
              <FormField
                label="Budget (₹)"
                placeholder="1500"
                value={budget}
                onChangeText={(v) => {
                  setBudget(v);
                  setError(null);
                }}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Status picker */}
          <View style={styles.statusSection}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.statusChips}>
              {SURPRISE_STATUSES.map((item) => {
                const active = status === item;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setStatus(item)}
                    style={[styles.statusChip, active && styles.statusChipOn]}>
                    <Text style={[styles.statusChipLabel, active && styles.statusChipLabelOn]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            label={busy ? 'Saving…' : 'Save Changes'}
            onPress={() => void save()}
            loading={busy}
            disabled={!surprise}
          />
          <PrimaryButton
            label="Cancel"
            variant="ghost"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/account'))}
          />
        </View>
      </ScrollView>
    </AppFrame>
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
  pageHeader: {
    gap: 4,
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  pageTitle: {
    color: Colors.snow,
    fontFamily: Fonts.displayExtra,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  form: {
    gap: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  grow: {
    flex: 1,
  },
  statusSection: {
    gap: Spacing.sm,
  },
  statusLabel: {
    color: Colors.snow,
    fontFamily: Fonts.uiMedium,
    fontSize: 14,
  },
  statusChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statusChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.raised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusChipOn: {
    backgroundColor: Colors.pinkMuted,
    borderColor: Colors.pink,
  },
  statusChipLabel: {
    color: Colors.muted,
    fontFamily: Fonts.uiMedium,
    fontSize: 14,
  },
  statusChipLabelOn: {
    color: Colors.snow,
  },
  actions: {
    gap: Spacing.md,
  },
});
