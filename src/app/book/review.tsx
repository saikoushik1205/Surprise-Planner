import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Banner } from '@/components/Banner';
import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';
import { useSurprises } from '@/context/SurpriseContext';
import {
  BOOKING_CREWS,
  BOOKING_OCCASIONS,
  BOOKING_SLOTS,
  formatShortDate,
  quoteBooking,
} from '@/data/booking';
import { saveLaunch } from '@/data/liveSession';
import { buildLaunchInput } from '@/services/launchBooking';
import { formatBudget } from '@/utils/format';

export default function BookReviewScreen() {
  const { user } = useAuth();
  const { draft, resetDraft } = usePlan();
  const { createSurprise } = useSurprises();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const quote = quoteBooking(draft);
  const occasion = BOOKING_OCCASIONS.find((item) => item.id === draft.occasion);
  const crew = BOOKING_CREWS.find((item) => item.id === draft.crewTier);
  const slot = BOOKING_SLOTS.find((item) => item.id === draft.slot);

  async function launchMission() {
    if (!draft.occasion || !draft.recipientName.trim() || (!draft.venue && !draft.address)) {
      setError('Finish the booking before launching.');
      return;
    }
    if (!user) {
      router.push({ pathname: '/login', params: { next: '/book/review' } });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { input, revealText } = buildLaunchInput(draft);
      const created = await createSurprise(input);
      saveLaunch(created.id, { recipientName: created.recipient, revealText });
      resetDraft();
      router.replace({ pathname: '/confirmation', params: { id: created.id } });
    } catch (launchError) {
      setError(launchError instanceof Error ? launchError.message : 'Could not launch this surprise.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <BookingFrame
      stage={6}
      stageLabel="Step 6 of 6"
      continueLabel={busy ? 'Launching…' : user ? 'Launch Mission' : 'Log in to launch'}
      continueDisabled={busy}
      onContinue={() => void launchMission()}
    >
      <View style={styles.head}>
        <View>
          <Text style={styles.eyebrow}>Step 06 · Review</Text>
          <Text style={styles.title}>Mission Summary</Text>
        </View>
        <View style={styles.target}>
          <Text style={styles.targetName}>{draft.recipientName || 'Target'}</Text>
          <Text style={styles.targetRel}>• {draft.relationship || 'Secret'}</Text>
        </View>
      </View>
      {error ? <Banner tone="error" message={error} /> : null}

      <View style={styles.card}>
        <Text style={styles.section}>Target location & window</Text>
        <View style={styles.grid}>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>{formatShortDate(draft.date)}</Text>
            <Text style={styles.cellSub}>{slot?.label ?? 'Window pending'}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>{draft.address || 'Address pending'}</Text>
            <Text style={styles.cellSub}>
              {[draft.landmark, draft.area, draft.city].filter(Boolean).join(', ') || 'City pending'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.section}>Package items</Text>
          <Text style={styles.ok}>{occasion?.label ?? 'Occasion'} · {crew?.badge ?? 'Crew'}</Text>
        </View>
        {quote.lines.map((line) => (
          <View key={line.name} style={styles.line}>
            <Text style={styles.lineName}>{line.name}</Text>
            <Text style={styles.linePrice}>{formatBudget(line.price)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Estimated total</Text>
          <Text style={styles.total}>{formatBudget(quote.total)}</Text>
        </View>
      </View>

      {draft.message || draft.loves ? (
        <View style={styles.card}>
          <Text style={styles.section}>Magic notes</Text>
          {draft.loves ? <Text style={styles.note}>{draft.loves}</Text> : null}
          {draft.message ? <Text style={styles.note}>{draft.message}</Text> : null}
        </View>
      ) : null}
    </BookingFrame>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 22,
    marginTop: 4,
  },
  target: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1F1F24',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  targetName: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
  },
  targetRel: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  card: {
    backgroundColor: '#1F1F24',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  section: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  cell: {
    flex: 1,
  },
  cellTitle: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  cellSub: {
    color: Colors.pink,
    fontFamily: Fonts.body,
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ok: {
    color: '#38BDF8',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1A1B20',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  lineName: {
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 12,
    flex: 1,
  },
  linePrice: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  totalLabel: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  total: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 18,
  },
  note: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
