export type PlanOccasion = {
  id: string;
  label: string;
  emoji: string;
  base: number;
};

export type PlanVibe = {
  id: string;
  label: string;
  line: string;
  swatches: string[];
};

export type PlanVenue = {
  id: string;
  label: string;
  line: string;
  price: number;
};

export type PlanAddon = {
  id: string;
  label: string;
  line: string;
  price: number;
  needsMessage?: boolean;
};

export const PLAN_OCCASIONS: PlanOccasion[] = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', base: 4999 },
  { id: 'proposal', label: 'Proposal', emoji: '💍', base: 7999 },
  { id: 'romantic-date', label: 'Romantic Date', emoji: '🌹', base: 5999 },
  { id: 'anniversary', label: 'Anniversary', emoji: '🥂', base: 6999 },
  { id: 'farewell', label: 'Farewell', emoji: '✈️', base: 4499 },
  { id: 'baby-shower', label: 'Baby Shower', emoji: '👶', base: 5499 },
];

export const PLAN_VIBES: PlanVibe[] = [
  {
    id: 'bohemian-sunset',
    label: 'Bohemian Sunset',
    line: 'Terracotta, dried flowers, golden hour.',
    swatches: ['#C45C26', '#E8A87C', '#F4D6A0', '#3D1F12'],
  },
  {
    id: 'crimson-candlelight',
    label: 'Crimson Candlelight',
    line: 'Deep reds, wax glow, hush-romance.',
    swatches: ['#8B1E3F', '#C23B4A', '#F2C6C2', '#1A0B10'],
  },
  {
    id: 'neon-midnight',
    label: 'Neon Midnight',
    line: 'Electric pink, indigo, after-hours.',
    swatches: ['#FF2D8A', '#6C5CE7', '#00F5D4', '#07070B'],
  },
  {
    id: 'pastel-dream',
    label: 'Pastel Dream',
    line: 'Blush, lilac, soft daylight.',
    swatches: ['#F7C6D4', '#C9B8FF', '#B8E0D2', '#FFF7F2'],
  },
];

export const PLAN_VENUES: PlanVenue[] = [
  { id: 'home', label: 'Private Home / Balcony', line: 'Intimate. We come to their door.', price: 0 },
  { id: 'rooftop', label: 'Rooftop Dining', line: 'City lights, reserved table, wow factor.', price: 2499 },
  { id: 'theater', label: 'Private Theater / Cabana', line: 'A room that feels like a movie.', price: 3999 },
  { id: 'garden', label: 'Garden / Farmhouse', line: 'Open air, string lights, space to breathe.', price: 2999 },
  { id: 'yacht', label: 'Luxury Yacht / Drive-in', line: 'The grand gesture. Unforgettable.', price: 9999 },
];

export const PLAN_ADDONS: PlanAddon[] = [
  { id: 'musician', label: 'Live Acoustic Musician', line: 'Violin or guitar, 30 minutes.', price: 2499 },
  { id: 'polaroid', label: 'Instant Polaroid & Memory Board', line: 'Printed on the spot.', price: 1499 },
  { id: 'neon', label: 'Custom Neon / Marquee Letters', line: 'Their name, or a three-word punchline.', price: 2999 },
  {
    id: 'cake-flowers',
    label: 'Artisan Cake & Flower Bouquet',
    line: 'Custom icing message included.',
    price: 1299,
    needsMessage: true,
  },
  { id: 'drone', label: 'Drone Capture Snippet', line: 'Outdoor only. 20-second clip.', price: 3499 },
];

export const TRACK_STEPS = [
  { id: 1, title: 'Decorator Dispatched', detail: 'Crew is en route with the kit.' },
  { id: 2, title: 'On-Site Setup Underway', detail: 'Lights, flowers, and layout going in.' },
  { id: 3, title: 'Final Quality Check Complete', detail: 'Details checked against your brief.' },
  { id: 4, title: 'Cake & Props Staged', detail: 'The table is dressed. The reveal is ready.' },
  { id: 5, title: 'Ready for Grand Entry', detail: 'Hold. Wait for them to walk in.' },
] as const;

export const MISSION_OCCASION: Record<string, string> = {
  'birthday-raid': 'birthday',
  'midnight-mission': 'romantic-date',
  'romantic-surprise': 'romantic-date',
  'bollywood-moment': 'birthday',
  'nri-love-package': 'anniversary',
  'proposal-setup': 'proposal',
  'facemask-raid': 'birthday',
  'mall-ambush': 'birthday',
  'outdoor-banner-drop': 'birthday',
  'flash-mob': 'proposal',
  'caravan-surprise': 'anniversary',
  'magic-moment': 'anniversary',
  'bollywood-entry': 'birthday',
  'graduation-sendoff': 'birthday',
};

export const MOOD_VIBE: Record<string, string> = {
  loved: 'crimson-candlelight',
  laughing: 'neon-midnight',
  emotional: 'pastel-dream',
  shocked: 'neon-midnight',
  celebrated: 'bohemian-sunset',
  speechless: 'crimson-candlelight',
};

export const AI_PRESETS = [
  {
    id: 'mumbai-birthday',
    label: 'Birthday in Mumbai',
    occasion: 'birthday',
    vibe: 'neon-midnight',
    venue: 'home',
    addons: ['cake-flowers'],
    city: 'Mumbai',
  },
  {
    id: 'rooftop-proposal',
    label: 'Rooftop proposal',
    occasion: 'proposal',
    vibe: 'crimson-candlelight',
    venue: 'rooftop',
    addons: ['musician', 'neon'],
    city: 'Hyderabad',
  },
  {
    id: 'nri-family',
    label: 'NRI family moment',
    occasion: 'anniversary',
    vibe: 'pastel-dream',
    venue: 'home',
    addons: ['cake-flowers', 'polaroid'],
    city: 'Delhi',
  },
] as const;

export function defaultPlanDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function quotePlan(draft: { occasion: string; venue: string; addons: string[] }) {
  const lines: { name: string; price: number }[] = [];
  const occasion = PLAN_OCCASIONS.find((item) => item.id === draft.occasion);
  const venue = PLAN_VENUES.find((item) => item.id === draft.venue);
  if (occasion) {
    lines.push({ name: occasion.label, price: occasion.base });
  }
  if (venue && venue.price > 0) {
    lines.push({ name: venue.label, price: venue.price });
  }
  for (const id of draft.addons) {
    const addon = PLAN_ADDONS.find((item) => item.id === id);
    if (addon) {
      lines.push({ name: addon.label, price: addon.price });
    }
  }
  const total = lines.reduce((sum, line) => sum + line.price, 0);
  return { lines, total };
}
