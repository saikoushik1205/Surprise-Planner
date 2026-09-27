import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

export type PromptChip = {
  emoji: string;
  label: string;
  accent?: 'ink' | 'pink' | 'violet';
};

export const FLOATING_PROMPT_ROWS: PromptChip[][] = [
  [
    { emoji: '🎂', label: 'Birthday surprise for sister' },
    { emoji: '✨', label: 'Surprise me completely', accent: 'pink' },
    { emoji: '☕', label: 'Cafés with best offers' },
    { emoji: '💕', label: 'Romantic dinner with private terrace', accent: 'pink' },
  ],
  [
    { emoji: '🎁', label: 'Surprise gift under ₹5,000' },
    { emoji: '🌅', label: 'Sunset date in Hyderabad', accent: 'violet' },
    { emoji: '🤰', label: 'Secret baby shower' },
    { emoji: '🕯️', label: 'Candlelight terrace evening', accent: 'pink' },
  ],
  [
    { emoji: '🎓', label: 'Graduation celebration' },
    { emoji: '🎶', label: 'Live acoustic reveal', accent: 'violet' },
    { emoji: '🍰', label: 'Custom cake reveal' },
    { emoji: '✨', label: 'Weekend getaway roadmap', accent: 'violet' },
  ],
];

type FloatingPromptRowsProps = {
  selected?: string;
  onPick: (chip: PromptChip) => void;
};

export function FloatingPromptRows({ selected, onPick }: FloatingPromptRowsProps) {
  return (
    <View style={styles.wrap}>
      {FLOATING_PROMPT_ROWS.map((row, index) => (
        <ScrollView
          key={index}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {row.map((chip) => {
            const on = selected === chip.label;
            return (
              <Pressable
                key={chip.label}
                accessibilityRole="button"
                accessibilityLabel={chip.label}
                onPress={() => onPick(chip)}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={styles.emoji}>{chip.emoji}</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    chip.accent === 'pink' && styles.pink,
                    chip.accent === 'violet' && styles.violet,
                    on && styles.labelOn,
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    marginHorizontal: -16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipOn: {
    backgroundColor: Colors.pink,
    borderColor: Colors.pink,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
    lineHeight: 18,
  },
  pink: {
    color: Colors.pinkHot,
  },
  violet: {
    color: '#8B83FF',
  },
  labelOn: {
    color: '#ffffff',
  },
});
