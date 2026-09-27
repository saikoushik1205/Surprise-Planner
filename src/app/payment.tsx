import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Banner } from '@/components/Banner';
import { Pill } from '@/components/fit';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';
import { useSurprises } from '@/context/SurpriseContext';
import { saveLaunch } from '@/data/liveSession';
import { quoteForDraft, buildLaunchInput } from '@/services/launchBooking';
import { formatBudget } from '@/utils/format';

export default function PaymentScreen() {
  const { user } = useAuth();
  const { draft, patchDraft, resetDraft } = usePlan();
  const { createSurprise } = useSurprises();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const quote = quoteForDraft(draft);
  const due = draft.payMode === 'half' ? Math.round(quote.total / 2) : quote.total;

  async function pay() {
    if (!draft.occasion || !draft.recipientName.trim() || (!draft.venue && !draft.address)) {
      setError('Finish the booking before paying.');
      return;
    }
    if (!user) {
      router.push({ pathname: '/login', params: { next: '/payment' } });
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
    } catch (payError) {
      setError(payError instanceof Error ? payError.message : 'Payment could not be completed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppFrame>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>Pay to launch</Text>
        <Text style={styles.title}>{formatBudget(due)}</Text>
        <Text style={styles.sub}>
          {draft.payMode === 'half' ? 'Deposit today. The rest is due before the crew rolls.' : 'Full amount. The crew is briefed after this.'}
        </Text>
        {error ? <Banner tone="error" message={error} /> : null}
        <View style={styles.options}>
          <View style={styles.grow}>
            <Pill
              label={`Full ${formatBudget(quote.total)}`}
              tone={draft.payMode === 'full' ? 'pink' : 'ghost'}
              onPress={() => patchDraft({ payMode: 'full' })}
            />
          </View>
          <View style={styles.grow}>
            <Pill
              label="50% now"
              tone={draft.payMode === 'half' ? 'pink' : 'ghost'}
              onPress={() => patchDraft({ payMode: 'half' })}
            />
          </View>
        </View>
        <View style={styles.spacer} />
        <Pill label={busy ? 'Launching…' : user ? 'Launch the mission' : 'Log in to launch'} disabled={busy} onPress={() => void pay()} />
      </View>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 8,
    gap: 10,
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
    fontFamily: Fonts.displayExtra,
    fontSize: 40,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  options: {
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
