import { router } from 'expo-router';
import { Check, Radar } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { BOOKING_TRANSPORT } from '@/data/booking';
import { formatBudget } from '@/utils/format';

export default function BookTransportScreen() {
  const { draft, patchDraft } = usePlan();

  return (
    <BookingFrame stage={3} stageLabel="Step 03 Builder" continueDisabled={!draft.transport} onContinue={() => router.push('/book/treats')}>
      <View>
        <Text style={styles.eyebrow}>Step 03B · Transport</Text>
        <Text style={styles.title}>How does the crew arrive?</Text>
        <Text style={styles.sub}>We coordinate transit so the surprise stays secret until the drop.</Text>
      </View>

      <View style={styles.banner}>
        <Radar color={Colors.pink} size={18} />
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerTitle}>Silent Staging Zone</Text>
          <Text style={styles.bannerLine}>Crew parks 150m away to prevent alerting the target.</Text>
        </View>
      </View>

      <View style={styles.list}>
        {BOOKING_TRANSPORT.map((item) => {
          const on = draft.transport === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => patchDraft({ transport: item.id })}
              style={[styles.card, on && styles.cardOn]}
            >
              <View style={styles.mid}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.label}</Text>
                  <Text style={[styles.badge, on && styles.badgeOn]}>{item.badge}</Text>
                </View>
                <Text style={styles.line}>{item.line}</Text>
              </View>
              <View style={styles.cost}>
                <Text style={[styles.price, on && styles.priceOn]}>{item.price === 0 ? '₹0' : formatBudget(item.price)}</Text>
                <Text style={styles.hint}>{item.hint}</Text>
              </View>
              <View style={[styles.check, on && styles.checkOn]}>{on ? <Check color="#FFFFFF" size={12} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
    </BookingFrame>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1A1B20',
    borderRadius: 14,
    padding: 12,
  },
  bannerCopy: {
    flex: 1,
  },
  bannerTitle: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  bannerLine: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  list: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1F1F24',
    borderRadius: 16,
    padding: 12,
  },
  cardOn: {
    backgroundColor: '#292A2E',
    boxShadow: '0 0 18px rgba(255,45,120,0.22)',
  },
  mid: {
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
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
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
  badgeOn: {
    color: Colors.pink,
    backgroundColor: 'rgba(255,45,120,0.18)',
  },
  line: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
    marginTop: 3,
  },
  cost: {
    alignItems: 'flex-end',
  },
  price: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
  },
  priceOn: {
    color: Colors.pink,
  },
  hint: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 10,
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
});
