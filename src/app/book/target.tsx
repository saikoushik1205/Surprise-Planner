import { router, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, Lock, MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { BOOKING_CITIES, BOOKING_RELATIONSHIPS } from '@/data/booking';
import { MISSION_OCCASION, MOOD_VIBE } from '@/data/planner';

export default function BookTargetScreen() {
  const params = useLocalSearchParams<{ mission?: string; mood?: string; type?: string }>();
  const { draft, patchDraft } = usePlan();
  const [error, setError] = useState<string | null>(null);
  const named = draft.recipientName.trim().length >= 2;

  useEffect(() => {
    const rawOccasion = params.mission ? MISSION_OCCASION[params.mission] : undefined;
    const occasion =
      rawOccasion === 'romantic-date' || rawOccasion === 'farewell' || rawOccasion === 'baby-shower'
        ? rawOccasion === 'romantic-date'
          ? 'proposal'
          : 'celebration'
        : rawOccasion;
    const vibe = params.mood ? MOOD_VIBE[params.mood] : undefined;
    if (occasion || vibe || params.type === 'group') {
      patchDraft({
        ...(occasion ? { occasion } : {}),
        ...(vibe ? { vibe } : {}),
        ...(params.type === 'group' ? { group: true } : {}),
      });
    }
  }, [params.mission, params.mood, params.type, patchDraft]);

  function continueMission() {
    if (!named) {
      setError('Add their name to lock the target.');
      return;
    }
    if (!draft.relationship) {
      setError('Pick your relationship.');
      return;
    }
    router.push('/book/moment');
  }

  return (
    <BookingFrame stage={1} stageLabel="Step 01 Target" continueDisabled={!named} onContinue={continueMission}>
      <View style={styles.hero}>
        <View style={styles.pulseRow}>
          <View style={styles.dot} />
          <Text style={styles.eyebrow}>Step 01 · Target</Text>
        </View>
        <Text style={styles.title}>Who&apos;s the target?</Text>
        <Text style={styles.sub}>Tell us who gets the magic. We&apos;ll handle the rest.</Text>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            Their name <Text style={styles.star}>*</Text>
          </Text>
          <View style={styles.secret}>
            <Lock color={Colors.muted} size={12} />
            <Text style={styles.secretText}>Secret mission</Text>
          </View>
        </View>
        <View style={styles.inputShell}>
          <TextInput
            autoCapitalize="words"
            onChangeText={(recipientName) => {
              patchDraft({ recipientName });
              setError(null);
            }}
            placeholder="e.g. Koushik"
            placeholderTextColor="#64748B"
            style={styles.input}
            value={draft.recipientName}
          />
          {named ? <BadgeCheck color="#22C55E" size={18} /> : null}
        </View>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            Their city <Text style={styles.star}>*</Text>
          </Text>
          <Text style={styles.live}>Same-day delivery active</Text>
        </View>
        <View style={styles.cityWrap}>
          {BOOKING_CITIES.map((city) => {
            const on = draft.city === city.id;
            return (
              <Pressable
                key={city.id}
                accessibilityRole="button"
                onPress={() => patchDraft({ city: city.id })}
                style={[styles.cityChip, on && styles.cityOn]}
              >
                {on ? <MapPin color="#FFFFFF" size={12} /> : null}
                <Text style={[styles.cityLabel, on && styles.cityLabelOn]}>{city.id}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            Your relationship <Text style={styles.star}>*</Text>
          </Text>
          <Text style={styles.hint}>Sets the surprise tone</Text>
        </View>
        <View style={styles.chips}>
          {BOOKING_RELATIONSHIPS.map((item) => {
            const on = draft.relationship === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => patchDraft({ relationship: item.id })}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{item.label}</Text>
                <Text>{item.emoji}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.guarantee}>
        <Text style={styles.gEyebrow}>Stealth Guarantee</Text>
        <Text style={styles.gTitle}>100% Anonymous Delivery</Text>
        <Text style={styles.gCopy}>Your secret identity stays protected until the exact reveal.</Text>
      </View>
    </BookingFrame>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#1A1B20',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.pink,
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  field: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  star: {
    color: Colors.pink,
  },
  secret: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secretText: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  live: {
    color: '#38BDF8',
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  hint: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  inputShell: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: '#1F1F24',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 16,
    paddingVertical: 12,
  },
  cityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: '#1F1F24',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityOn: {
    backgroundColor: Colors.pink,
  },
  cityLabel: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  cityLabelOn: {
    color: '#FFFFFF',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: '#1F1F24',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipOn: {
    backgroundColor: Colors.pink,
    boxShadow: '0 0 20px rgba(255,45,120,0.4)',
  },
  chipText: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  chipTextOn: {
    color: '#FFFFFF',
  },
  error: {
    color: '#FFB4AB',
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  guarantee: {
    backgroundColor: '#292A2E',
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  gEyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gTitle: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 16,
  },
  gCopy: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
  },
});
