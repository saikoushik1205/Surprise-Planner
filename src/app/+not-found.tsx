import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { AppScreen } from '@/components/layout/AppScreen';
import { Colors, Spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <AppScreen backgroundColor={Colors.ink}>
      <View style={styles.page}>
        <EmptyState
          title="Page not found"
          message="This page doesn't exist. Head back to the home screen."
          actionLabel="Back to Home"
          onAction={() => router.replace('/')}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
});
