import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { BOOKING_TREATS } from '@/data/booking';
import { formatBudget } from '@/utils/format';

export default function BookTreatsScreen() {
  const { draft, patchDraft } = usePlan();

  function toggleTreat(id: string) {
    const selected = draft.treats.includes(id);
    const treats = selected ? draft.treats.filter((item) => item !== id) : [...draft.treats, id];
    patchDraft({ treats, skipTreats: false });
  }

  function skipTreats() {
    patchDraft({ skipTreats: !draft.skipTreats, treats: draft.skipTreats ? draft.treats : [] });
  }

  return (
    <BookingFrame stage={3} stageLabel="Step 03 Builder" onContinue={() => router.push('/book/magic')}>
      <View>
        <Text style={styles.eyebrow}>Step 03C · Sweet Stuff</Text>
        <Text style={styles.title}>Add something delicious.</Text>
        <Text style={styles.sub}>Freshly baked delights delivered undercover.</Text>
      </View>

      <View style={styles.grid}>
        {BOOKING_TREATS.map((item) => {
          const on = !draft.skipTreats && draft.treats.includes(item.id);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => toggleTreat(item.id)}
              style={[styles.card, on && styles.cardOn]}
            >
              <View style={styles.art}>
                <Image contentFit="cover" source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.badge}>{item.badge}</Text>
                {on ? (
                  <View style={styles.tick}>
                    <Check color="#FFFFFF" size={12} />
                  </View>
                ) : null}
              </View>
              <View style={styles.row}>
                <Text style={[styles.name, on && styles.nameOn]} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={[styles.price, on && styles.nameOn]}>{formatBudget(item.price)}</Text>
              </View>
              <Text style={[styles.line, on && styles.lineOn]}>{item.line}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable accessibilityRole="button" onPress={skipTreats} style={[styles.skip, draft.skipTreats && styles.skipOn]}>
        <View>
          <Text style={styles.skipTitle}>No sweets needed, just the vibes</Text>
          <Text style={styles.skipLine}>Skip confectioneries and save room</Text>
        </View>
        <View style={[styles.check, draft.skipTreats && styles.checkOn]}>
          {draft.skipTreats ? <Check color="#FFFFFF" size={12} /> : null}
        </View>
      </Pressable>
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
    fontSize: 22,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#292A2E',
    borderRadius: 16,
    padding: 8,
  },
  cardOn: {
    backgroundColor: Colors.pink,
    boxShadow: '0 0 18px rgba(255,45,120,0.32)',
  },
  art: {
    height: 88,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#121118',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(12,11,16,0.82)',
    color: Colors.snow,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 9,
  },
  tick: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  name: {
    flex: 1,
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
  },
  nameOn: {
    color: '#FFFFFF',
  },
  price: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
  },
  line: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
    marginTop: 2,
  },
  lineOn: {
    color: 'rgba(255,255,255,0.82)',
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1B20',
    borderRadius: 16,
    padding: 12,
  },
  skipOn: {
    borderWidth: 1,
    borderColor: Colors.pink,
  },
  skipTitle: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  skipLine: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
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
