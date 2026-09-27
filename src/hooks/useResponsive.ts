import { useWindowDimensions } from 'react-native';

import { Layout } from '@/constants/theme';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isPhone = width < Layout.tablet;
  const isTablet = width >= Layout.tablet && width < Layout.desktop;
  const isDesktop = width >= Layout.desktop;
  const phoneShell = Math.min(width, Layout.phone);
  const wideShell = Math.min(width, isDesktop ? Layout.contentMax : isTablet ? 720 : width);
  const contentMaxWidth = wideShell;
  // Wider padding on tablet+, tighter on phone
  const horizontalPadding = isDesktop ? 32 : isTablet ? 24 : 16;
  // Number of columns for card grids
  const cardColumns = isDesktop ? 3 : isTablet ? 2 : 1;
  // True grid card width given columns and padding
  function gridCardWidth(columns = cardColumns, gap = 12) {
    const shell = wideShell;
    const totalGaps = (columns - 1) * gap;
    const totalPad = horizontalPadding * 2;
    return Math.floor((shell - totalPad - totalGaps) / columns);
  }

  return {
    width,
    height,
    isPhone,
    isTablet,
    isDesktop,
    phoneShell,
    wideShell,
    contentMaxWidth,
    horizontalPadding,
    cardColumns,
    gridCardWidth,
  };
}
