import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { CrewColors, CrewFonts, CrewGradients, CrewRadius, CrewShadow } from '@/constants/crewTheme';

type PillButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'light';
  style?: StyleProp<ViewStyle>;
};

export function PillButton({ label, onPress, variant = 'primary', style }: PillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primaryShadow,
        variant === 'secondary' && styles.secondary,
        variant === 'light' && styles.light,
        pressed && styles.pressed,
        style,
      ]}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={CrewGradients.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <Text style={[styles.label, variant === 'light' && styles.lightLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: CrewRadius.pill,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primaryShadow: {
    boxShadow: CrewShadow.cta,
  },
  secondary: {
    borderWidth: 1,
    borderColor: CrewColors.border,
    backgroundColor: 'transparent',
  },
  light: {
    backgroundColor: CrewColors.text,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 16,
    lineHeight: 20,
  },
  lightLabel: {
    color: CrewColors.pink,
  },
});
