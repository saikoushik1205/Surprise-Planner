export const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Proposal',
  'Romantic',
  'Festival',
  'Graduation',
  'Other',
] as const;

export type Occasion = (typeof OCCASIONS)[number];
