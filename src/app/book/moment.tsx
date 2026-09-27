import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { BOOKING_OCCASIONS } from '@/data/booking';

export default function BookMomentScreen() {
  const { draft, patchDraft } = usePlan();
  const [error, setError] = useState<string | null>(null);

  function continueMission() {
    if (!draft.occasion) {
      setError('Pick the occasion first.');
      return;
    }
    router.push('/book/crew');
  }

  return (
    <BookingFrame stage={2} stageLabel="Step 02 Moment" continueDisabled={!draft.occasion} onContinue={continueMission}>
      <View>
        <Text style={styles.eyebrow}>Step 02 · Moment</Text>
        <Text style={styles.title}>What&apos;s the occasion?</Text>
        <Text style={styles.sub}>Pick the moment. We&apos;ll match the energy.</Text>
      </View>

      <View style={styles.list}>
        {BOOKING_OCCASIONS.map((item) => {
          const on = draft.occasion === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => {
                patchDraft({ occasion: item.id });
                setError(null);
              }}
              style={[styles.card, on && styles.cardOn]}
            >
              <View style={[styles.icon, on && styles.iconOn]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.copy}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.label}</Text>
                  {item.popular && !on ? <Text style={styles.popular}>Popular</Text> : null}
                  {on ? <Text style={styles.selected}>Selected</Text> : null}
                </View>
                <Text style={[styles.line, on && styles.lineOn]}>{item.line}</Text>
              </View>
              <View style={[styles.check, on && styles.checkOn]}>{on ? <Check color="#FFFFFF" size={14} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </BookingFrame>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1F1F24',
    borderRadius: 16,
    padding: 12,
  },
  cardOn: {
    backgroundColor: 'rgba(255,45,120,0.16)',
    boxShadow: '0 0 16px rgba(255,45,120,0.28)',
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#343439',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOn: {
    backgroundColor: 'rgba(255,45,120,0.28)',
  },
  emoji: {
    fontSize: 20,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  name: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 15,
  },
  popular: {
    color: Colors.pink,
    backgroundColor: 'rgba(255,45,120,0.12)',
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  selected: {
    color: '#FFFFFF',
    backgroundColor: Colors.pink,
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },
  line: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    marginTop: 2,
  },
  lineOn: {
    color: Colors.pink,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#343439',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: Colors.pink,
  },
  error: {
    color: '#FFB4AB',
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
});
