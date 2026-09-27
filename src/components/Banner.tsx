import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/constants/theme';

type BannerProps = {
  tone: 'success' | 'error';
  message: string;
};

export function Banner({ tone, message }: BannerProps) {
  const isSuccess = tone === 'success';

  return (
    <View style={[styles.banner, isSuccess ? styles.success : styles.error]}>
      <Text style={[styles.text, isSuccess ? styles.successText : styles.errorText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  success: {
    backgroundColor: 'rgba(46, 230, 182, 0.12)',
    borderColor: 'rgba(46, 230, 182, 0.35)',
  },
  error: {
    backgroundColor: 'rgba(255, 77, 109, 0.12)',
    borderColor: 'rgba(255, 77, 109, 0.35)',
  },
  text: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  successText: {
    color: Colors.success,
  },
  errorText: {
    color: Colors.danger,
  },
});
