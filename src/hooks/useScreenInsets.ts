import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Minimum space so footers clear Android gesture / iPhone home bars. */
export const SCREEN_BOTTOM_MIN = 12;

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  return {
    top: insets.top,
    right: insets.right,
    bottom: insets.bottom,
    left: insets.left,
    padTop: insets.top,
    padBottom: Math.max(insets.bottom, SCREEN_BOTTOM_MIN),
  };
}
