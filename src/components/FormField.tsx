import { type ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, Fonts, Radius } from '@/constants/theme';

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children?: ReactNode;
} & TextInputProps;

export function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  multiline,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children ?? (
        <TextInput
          placeholderTextColor={Colors.muted}
          {...inputProps}
          multiline={multiline}
          style={[styles.input, multiline && styles.multiline, error && styles.inputError, inputProps.style]}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    color: Colors.snow,
    fontFamily: Fonts.uiMedium,
    fontSize: 14,
  },
  required: {
    color: Colors.pink,
  },
  input: {
    minHeight: 52,
    borderRadius: Radius.pill,
    backgroundColor: Colors.raised,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.snow,
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  multiline: {
    minHeight: 120,
    borderRadius: Radius.lg,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.danger,
  },
  error: {
    color: Colors.danger,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  hint: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
});
