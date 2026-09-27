import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { MAGIC_PROMPTS } from '@/data/booking';

export default function BookMagicScreen() {
  const { draft, patchDraft } = usePlan();

  function insertPrompt(text: string) {
    const next = draft.loves.trim() ? `${draft.loves.trim()}${text}` : text.trim();
    patchDraft({ loves: next });
  }

  return (
    <BookingFrame stage={4} stageLabel="Step 04 Magic" onContinue={() => router.push('/book/when')}>
      <View>
        <Text style={styles.eyebrow}>Step 04 · Magic</Text>
        <Text style={styles.title}>Personalize the magic.</Text>
      </View>

      <View>
        <View style={styles.labelRow}>
          <Text style={styles.micro}>Quick inspo sparks</Text>
          <Text style={styles.hint}>Tap to insert</Text>
        </View>
        <View style={styles.prompts}>
          {MAGIC_PROMPTS.map((item) => (
            <Pressable key={item.id} accessibilityRole="button" onPress={() => insertPrompt(item.text)} style={styles.prompt}>
              <Text>{item.emoji}</Text>
              <Text style={styles.promptText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>✨ What do they love or avoid?</Text>
        <TextInput
          multiline
          onChangeText={(loves) => patchDraft({ loves })}
          placeholder="e.g. Loves cricket & old Telugu songs. Strictly no loud pranks..."
          placeholderTextColor="#64748B"
          style={styles.area}
          value={draft.loves}
        />
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>💌 Message for recipient / crew</Text>
          <View style={styles.modes}>
            <Pressable onPress={() => patchDraft({ messageMode: 'card' })} style={[styles.mode, draft.messageMode === 'card' && styles.modeOn]}>
              <Text style={[styles.modeText, draft.messageMode === 'card' && styles.modeTextOn]}>Card</Text>
            </Pressable>
            <Pressable onPress={() => patchDraft({ messageMode: 'spoken' })} style={[styles.mode, draft.messageMode === 'spoken' && styles.modeOn]}>
              <Text style={[styles.modeText, draft.messageMode === 'spoken' && styles.modeTextOn]}>Spoken</Text>
            </Pressable>
          </View>
        </View>
        <TextInput
          multiline
          onChangeText={(message) => patchDraft({ message, cakeMessage: message, revealText: message })}
          placeholder="Write card text, stealth crew notes or watchman tips here..."
          placeholderTextColor="#64748B"
          style={styles.area}
          value={draft.message}
        />
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
    fontSize: 22,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  micro: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  hint: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  prompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#292A2E',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  promptText: {
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 12,
  },
  field: {
    gap: 8,
  },
  label: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  area: {
    minHeight: 84,
    borderRadius: 16,
    backgroundColor: '#1A1B20',
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 14,
    padding: 12,
    textAlignVertical: 'top',
  },
  modes: {
    flexDirection: 'row',
    gap: 6,
  },
  mode: {
    borderRadius: 999,
    backgroundColor: '#292A2E',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeOn: {
    backgroundColor: Colors.pink,
  },
  modeText: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  modeTextOn: {
    color: '#FFFFFF',
  },
});
