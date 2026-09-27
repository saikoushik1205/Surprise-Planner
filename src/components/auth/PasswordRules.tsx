import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { type PasswordChecks } from '@/utils/authValidation';

const RULES: { key: keyof PasswordChecks; label: string }[] = [
  { key: 'minLength', label: 'At least 8 characters' },
  { key: 'uppercase', label: 'One uppercase letter' },
  { key: 'number', label: 'One number' },
];

type PasswordRulesProps = {
  checks: PasswordChecks;
};

export function PasswordRules({ checks }: PasswordRulesProps) {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      {RULES.map((rule) => {
        const met = checks[rule.key];
        return (
          <Text key={rule.key} style={[styles.rule, met ? styles.met : styles.unmet]}>
            {met ? '✓' : '○'} {rule.label}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rule: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  met: {
    color: Colors.success,
  },
  unmet: {
    color: Colors.muted,
  },
});
