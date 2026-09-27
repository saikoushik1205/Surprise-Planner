import { router } from 'expo-router';
import { Check, Shield } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { BOOKING_CREWS } from '@/data/booking';
import { formatBudget } from '@/utils/format';

export default function BookCrewScreen() {
  const { draft, patchDraft } = usePlan();

  return (
    <BookingFrame stage={3} stageLabel="Step 03 Builder" continueDisabled={!draft.crewTier} onContinue={() => router.push('/book/transport')}>
      <View style={styles.head}>
        <View style={styles.meta}>
          <Text style={styles.eyebrow}>Step 03 · The Crew</Text>
          <View style={styles.lock}>
            <Shield color="#38BDF8" size={12} />
            <Text style={styles.lockText}>Covert Ops</Text>
          </View>
        </View>
        <Text style={styles.title}>Who shows up at the door?</Text>
        <Text style={styles.sub}>Pick your covert surprise operatives.</Text>
      </View>

      <View style={styles.list}>
        {BOOKING_CREWS.map((item) => {
          const on = draft.crewTier === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => patchDraft({ crewTier: item.id })}
              style={[styles.card, on && styles.cardOn]}
            >
              {item.recommended ? (
                <View style={styles.rec}>
                  <Text style={styles.recText}>Recommended</Text>
                </View>
              ) : null}
              <View style={styles.mid}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.label}</Text>
                  <Text style={styles.badge}>{item.badge}</Text>
                </View>
                <Text style={styles.line}>{item.line}</Text>
              </View>
              <Text style={[styles.price, on && styles.priceOn]}>{formatBudget(item.price)}</Text>
              <View style={[styles.check, on && styles.checkOn]}>{on ? <Check color="#FFFFFF" size={12} /> : null}</View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteEyebrow}>Operational Discretion Guaranteed</Text>
        <Text style={styles.noteCopy}>Operatives remain hidden until the target unlocks the door.</Text>
      </View>
    </BookingFrame>
  );
}

const styles = StyleSheet.create({
  head: {
    gap: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  lock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#292A2E',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lockText: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 22,
    marginTop: 6,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  list: {
    gap: 8,
  },
  card: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1A1B20',
    borderRadius: 16,
    padding: 12,
    paddingTop: 16,
  },
  cardOn: {
    backgroundColor: '#292A2E',
    boxShadow: '0 0 20px rgba(255,45,120,0.25)',
  },
  rec: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: Colors.pink,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  recText: {
    color: '#FFFFFF',
    fontFamily: Fonts.jakartaExtra,
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  mid: {
    flex: 1,
    minWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 15,
  },
  badge: {
    color: Colors.muted,
    backgroundColor: '#343439',
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },
  line: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
    marginTop: 3,
  },
  price: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
  },
  priceOn: {
    color: Colors.pink,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#343439',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: Colors.pink,
  },
  note: {
    backgroundColor: '#0D0E12',
    borderRadius: 14,
    padding: 12,
    gap: 2,
  },
  noteEyebrow: {
    color: '#38BDF8',
    fontFamily: Fonts.jakartaExtra,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  noteCopy: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
  },
});
