import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { useScreenInsets } from '@/hooks/useScreenInsets';
import { useResponsive } from '@/hooks/useResponsive';

type AppScreenProps = {
  children: ReactNode;
  /** Safe edges to pad. Omit bottom when a tab/dock already consumes the inset. */
  edges?: Edge[];
  backgroundColor?: string;
  /** Cap content width. Pass `null` to span the full window. */
  maxWidth?: number | null;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const DEFAULT_EDGES: Edge[] = ['top', 'bottom'];

export function AppScreen({
  children,
  edges = DEFAULT_EDGES,
  backgroundColor = '#07070A',
  maxWidth,
  style,
  contentStyle,
}: AppScreenProps) {
  const insets = useScreenInsets();
  const { phoneShell } = useResponsive();
  const widthCap = maxWidth === null ? undefined : (maxWidth ?? phoneShell);

  return (
    <View style={[styles.page, { backgroundColor }, style]}>
      <View
        {...({ className: 'app-shell' } as object)}
        style={[
          styles.shell,
          {
            maxWidth: widthCap,
            backgroundColor,
            paddingTop: edges.includes('top') ? insets.padTop : 0,
            paddingBottom: edges.includes('bottom') ? insets.padBottom : 0,
            paddingLeft: edges.includes('left') ? insets.left : 0,
            paddingRight: edges.includes('right') ? insets.right : 0,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  shell: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    overflow: 'hidden',
  },
});
