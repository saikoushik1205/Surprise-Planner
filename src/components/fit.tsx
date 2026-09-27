import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, Fonts, Radius } from '@/constants/theme';

export function Eyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Headline({ children, pink }: { children: string; pink?: boolean }) {
  return <Text style={[styles.headline, pink && styles.pink]}>{children}</Text>;
}

export function Field({
  label,
  ...input
}: { label: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.muted}
        accessibilityLabel={label}
        {...input}
        style={styles.input}
      />
    </View>
  );
}

export function Pill({
  label,
  onPress,
  tone = 'pink',
  disabled,
}: {
  label: string;
  onPress: () => void;
  tone?: 'pink' | 'ghost';
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        tone === 'ghost' && styles.pillGhost,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.pillLabel, tone === 'ghost' && styles.pillGhostLabel]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && styles.pressed]}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  headline: {
    color: Colors.snow,
    fontFamily: Fonts.displayExtra,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  pink: {
    color: Colors.pinkHot,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    color: Colors.muted,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
  },
  input: {
    minHeight: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.raised,
    color: Colors.snow,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pill: {
    minHeight: 42,
    borderRadius: Radius.pill,
    backgroundColor: Colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pillGhost: {
    backgroundColor: Colors.raised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillLabel: {
    color: Colors.snow,
    fontFamily: Fonts.ui,
    fontSize: 14,
  },
  pillGhostLabel: {
    color: Colors.snow,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.86,
  },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipOn: {
    borderColor: Colors.pink,
    backgroundColor: Colors.pinkMuted,
  },
  chipLabel: {
    color: Colors.muted,
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
  },
  chipLabelOn: {
    color: Colors.snow,
  },
});
