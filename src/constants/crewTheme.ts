export const CrewColors = {
  bg: '#0a0a0f',
  card: '#12121e',
  cardHover: '#1a1a2e',
  pink: '#ff2d78',
  pinkDeep: '#e11d74',
  pinkSection: '#be185d',
  purple: '#7c3aed',
  border: 'rgba(124, 58, 237, 0.3)',
  text: '#ffffff',
  muted: '#9ca3af',
  green: '#22c55e',
  heroTop: '#1a0a1e',
} as const;

export const CrewGradients = {
  hero: [CrewColors.heroTop, CrewColors.bg],
  cta: [CrewColors.pink, CrewColors.pinkDeep],
  section: [CrewColors.pink, CrewColors.pinkSection],
} as const;

export const CrewFonts = {
  display: 'SpaceGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodySemi: 'Inter_600SemiBold',
} as const;

export const CrewSpace = {
  screen: 20,
  card: 16,
  cardGap: 12,
  section: 40,
} as const;

export const CrewRadius = {
  card: 16,
  pill: 999,
  chip: 8,
} as const;

export const CrewShadow = {
  card: '0px 0px 12px rgba(124, 58, 237, 0.2)',
  cta: '0px 8px 24px rgba(255, 45, 120, 0.4)',
} as const;
