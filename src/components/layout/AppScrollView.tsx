import { forwardRef, type ReactNode } from 'react';
import { ScrollView, StyleSheet, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';

type AppScrollViewProps = ScrollViewProps & {
  children: ReactNode;
  /** Horizontal + modest vertical padding from the spacing scale. */
  padded?: boolean;
  /** Grow to fill the viewport so short screens do not bounce-scroll. */
  fill?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const AppScrollView = forwardRef<ScrollView, AppScrollViewProps>(function AppScrollView(
  {
    children,
    padded = true,
    fill = true,
    style,
    contentContainerStyle,
    keyboardShouldPersistTaps = 'handled',
    showsVerticalScrollIndicator = false,
    ...props
  },
  ref,
) {
  return (
    <ScrollView
      ref={ref}
      style={[styles.scroll, style]}
      contentContainerStyle={[fill && styles.fill, padded && styles.padded, contentContainerStyle]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
    >
      {children}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
  fill: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});
