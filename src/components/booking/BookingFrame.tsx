import { ArrowRight, PartyPopper, UserRound } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';
import { quoteBooking } from '@/data/booking';
import { usePlan } from '@/context/PlanContext';
import { useResponsive } from '@/hooks/useResponsive';
import { formatBudget } from '@/utils/format';

type BookingFrameProps = {
  stage: number;
  stageLabel: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  onContinue: () => void;
  children: ReactNode;
};

export function BookingFrame({
  stage,
  stageLabel,
  continueLabel = 'Continue Mission',
  continueDisabled,
  onContinue,
  children,
}: BookingFrameProps) {
  const { phoneShell } = useResponsive();
  const { draft } = usePlan();
  const quote = quoteBooking(draft);

  return (
    <View style={styles.page}>
      <SafeAreaView style={[styles.shell, { maxWidth: phoneShell }]} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View style={styles.brand}>
              <View style={styles.mark}>
                <PartyPopper color={Colors.pink} size={14} />
              </View>
              <Text style={styles.brandName}>Surprise Planner</Text>
            </View>
            <View style={styles.stageMeta}>
              <Text style={styles.flowLabel}>Mission Flow</Text>
              <Text style={styles.stageName} numberOfLines={1}>
                {stageLabel}
              </Text>
            </View>
            <View style={styles.avatar}>
              <UserRound color="#650031" size={14} />
            </View>
          </View>
          <View style={styles.progress}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} style={[styles.bar, index < stage && styles.barOn]} />
            ))}
          </View>
        </View>

        <ScrollView
          style={styles.scroller}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        <View style={styles.dock}>
          <View style={styles.estimate}>
            <Text style={styles.estLabel}>
              {quote.items ? `${quote.items} item${quote.items === 1 ? '' : 's'} selected` : 'No items yet'}
            </Text>
            <View style={styles.estRow}>
              <Text style={styles.estValue}>{quote.items ? formatBudget(quote.total) : '—'}</Text>
              {quote.items ? <Text style={styles.estHint}>est.</Text> : null}
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={continueDisabled}
            onPress={onContinue}
            style={({ pressed }) => [styles.cta, pressed && !continueDisabled && styles.pressed, continueDisabled && styles.ctaOff]}
          >
            <Text style={styles.ctaLabel}>{continueLabel}</Text>
            <ArrowRight color="#FFFFFF" size={18} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#07070A',
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.ink,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(12,11,16,0.92)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  mark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,45,120,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
  },
  stageMeta: {
    alignItems: 'flex-end',
  },
  flowLabel: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stageName: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    maxWidth: 110,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffb1c6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#292A2E',
  },
  barOn: {
    backgroundColor: Colors.pink,
    boxShadow: '0 0 8px rgba(255,45,120,0.6)',
  },
  scroller: {
    flex: 1,
    minHeight: 0,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(12,11,16,0.94)',
  },
  estimate: {
    minWidth: 96,
  },
  estLabel: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  estRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  estValue: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 20,
  },
  estHint: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  cta: {
    flex: 1,
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: Colors.pink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    boxShadow: '0 0 24px rgba(255,45,120,0.4)',
  },
  ctaOff: {
    opacity: 0.45,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
