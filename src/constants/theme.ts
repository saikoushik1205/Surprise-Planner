import { Platform } from 'react-native';

import '@/global.css';

export const Colors = {
  ink: '#0C0B10',
  snow: '#E6E1E8',
  pink: '#FF2D78',
  pinkHot: '#FF4C83',
  pinkMuted: 'rgba(255, 45, 120, 0.12)',
  panel: '#1B1922',
  raised: '#1E1C26',
  muted: '#A1A1AA',
  border: '#2B2737',
  danger: '#FFB4AB',
  success: '#25D366',
  overlay: 'rgba(12, 11, 16, 0.72)',
} as const;

export const StatusColors: Record<string, string> = {
  Draft: '#9A96A8',
  Planned: '#FF2D8A',
  Launched: '#2EE6B6',
  Completed: '#8B83FF',
};

export const Fonts = {
  display: 'Syne_700Bold',
  displayExtra: 'Syne_800ExtraBold',
  ui: 'SpaceGrotesk_600SemiBold',
  uiBold: 'SpaceGrotesk_700Bold',
  uiMedium: 'SpaceGrotesk_500Medium',
  jakarta: 'PlusJakartaSans_400Regular',
  jakartaMedium: 'PlusJakartaSans_500Medium',
  jakartaSemi: 'PlusJakartaSans_600SemiBold',
  jakartaBold: 'PlusJakartaSans_700Bold',
  jakartaExtra: 'PlusJakartaSans_800ExtraBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  fallback: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'system-ui',
  }),
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const Layout = {
  phone: 430,
  mobileMax: 560,
  tablet: 768,
  desktop: 1024,
  contentMax: 960,
} as const;
