import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Colors } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.page}>
      <EmptyState
        title="Page not found"
        message="This page doesn't exist. Head back to the home screen."
        actionLabel="Back to Home"
        onAction={() => router.replace('/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
