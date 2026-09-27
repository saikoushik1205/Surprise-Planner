export type Mission = {
  id: string;
  title: string;
  occasion: string;
  description: string;
  priceFrom: number;
  emoji: string;
  tags: string[];
  highlight?: boolean;
};

export const MISSIONS: Mission[] = [
  {
    id: 'birthday-raid',
    title: 'Birthday Raid',
    occasion: 'Birthday',
    description: 'A loud, joyful crew drops in with cake, chaos, and birthday energy.',
    priceFrom: 999,
    emoji: '🎂',
    tags: ['Birthday', 'Group', 'Indoor', 'Under 24-Hour'],
    highlight: true,
  },
  {
    id: 'midnight-mission',
    title: 'Midnight Mission',
    occasion: 'Anniversary',
    description: 'A late-night moment — quiet, cinematic, and impossible to forget.',
    priceFrom: 1999,
    emoji: '🌙',
    tags: ['Romantic', 'Indoor', 'Anniversary'],
    highlight: true,
  },
  {
    id: 'romantic-surprise',
    title: 'Romantic Surprise',
    occasion: 'Romantic',
    description: 'Roses, a handwritten letter, and a crew that knows how to set a scene.',
    priceFrom: 2499,
    emoji: '❤️',
    tags: ['Romantic', 'Indoor', 'Private'],
    highlight: true,
  },
  {
    id: 'bollywood-moment',
    title: 'Bollywood Moment',
    occasion: 'Other',
    description: 'A singer, a song, and main-character energy in the middle of the street.',
    priceFrom: 3499,
    emoji: '🎤',
    tags: ['Romantic', 'Public', 'Go Big', 'Outdoor'],
    highlight: true,
  },
  {
    id: 'nri-love-package',
    title: 'NRI Love Package',
    occasion: 'Festival',
    description: 'For the ones abroad — a full family moment back home, handled end to end.',
    priceFrom: 4999,
    emoji: '🌍',
    tags: ['NRI', 'Family', 'Festival'],
    highlight: true,
  },
  {
    id: 'proposal-setup',
    title: 'Proposal Setup',
    occasion: 'Proposal',
    description: 'The most important yes of their life — staged, timed, and secretly filmed.',
    priceFrom: 5999,
    emoji: '💍',
    tags: ['Proposal', 'Romantic', 'Premium'],
    highlight: true,
  },
  {
    id: 'facemask-raid',
    title: 'Facemask Raid',
    occasion: 'Birthday',
    description:
      'A wildcard crew shows up wearing custom masks of the recipient’s face — cake, chaos, and a reaction that writes itself.',
    priceFrom: 3999,
    emoji: '😂',
    tags: ['Birthday', 'Funny', 'Group', 'Wildcard'],
  },
  {
    id: 'mall-ambush',
    title: 'Mall Ambush',
    occasion: 'Other',
    description:
      'We intercept them in a busy mall — flowers, a reveal, and a crowd that suddenly becomes the audience.',
    priceFrom: 4999,
    emoji: '🛍️',
    tags: ['Birthday', 'Romantic', 'Public', 'Go Big'],
  },
  {
    id: 'outdoor-banner-drop',
    title: 'Outdoor Banner Drop',
    occasion: 'Other',
    description: 'A grand outdoor banner, a photo crew, and an Instagram-ready reveal in the open air.',
    priceFrom: 3499,
    emoji: '📸',
    tags: ['Birthday', 'Proposal', 'Outdoor', 'Go Big'],
  },
  {
    id: 'flash-mob',
    title: 'Flash Mob',
    occasion: 'Proposal',
    description: 'Dancers break into a choreographed number around them — premium, public, and unforgettable.',
    priceFrom: 12999,
    emoji: '💃',
    tags: ['Proposal', 'Go Big', 'Outdoor', 'Premium'],
  },
  {
    id: 'caravan-surprise',
    title: 'Caravan Surprise',
    occasion: 'Anniversary',
    description: 'A luxury surprise caravan rolls up — styled, soundtracked, and built for a premium reveal.',
    priceFrom: 7999,
    emoji: '🚐',
    tags: ['Anniversary', 'Proposal', 'Premium', 'Outdoor'],
  },
  {
    id: 'magic-moment',
    title: 'Magic Moment',
    occasion: 'Anniversary',
    description: 'A close-up magic performance built around them — premium, personal, and quietly spectacular.',
    priceFrom: 5999,
    emoji: '✨',
    tags: ['Anniversary', 'Birthday', 'Private', 'Digital'],
  },
  {
    id: 'bollywood-entry',
    title: 'Bollywood Entry',
    occasion: 'Other',
    description: 'A singer-led Bollywood entry — popular, premium energy without the full street production.',
    priceFrom: 3499,
    emoji: '🎤',
    tags: ['Birthday', 'Romantic', 'Indoor'],
  },
];

export const HIGHLIGHT_MISSIONS = MISSIONS.filter((mission) => mission.highlight);

export const CITIES = [
  'Hyderabad',
  'Mumbai',
  'Bangalore',
  'Delhi',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Kochi',
  'Chandigarh',
] as const;

export const LIVE_CITIES = CITIES.slice(0, 6);

export const RELATIONSHIPS = [
  { id: 'Friend', label: 'Friend 👫' },
  { id: 'Partner', label: 'Partner ❤️' },
  { id: 'Family', label: 'Family 🏠' },
  { id: 'Colleague', label: 'Colleague 💼' },
  { id: 'Secret Crush', label: 'Secret Crush 🤫' },
  { id: 'Other', label: 'Other ✨' },
] as const;

export const MOODS = [
  { id: 'loved', label: 'Loved' },
  { id: 'laughing', label: 'Laughing' },
  { id: 'emotional', label: 'Emotional' },
  { id: 'shocked', label: 'Shocked' },
  { id: 'celebrated', label: 'Celebrated' },
  { id: 'speechless', label: 'Speechless' },
] as const;

export const EXPERIENCE_FILTERS = [
  'All',
  'Birthday',
  'Romantic',
  'Funny',
  'Go Big',
  'Digital',
  'NRI',
  'Group',
  'Under ₹1000',
  'Premium ₹5000+',
] as const;

export const BUDGET_PRESETS = [1000, 3000, 5000, 8000, 15000] as const;

export const REACTIONS = [
  { id: '1', text: 'bro she literally started crying omg 😭😭😭', time: '9:14 PM' },
  { id: '2', text: 'WHAT IS THIS I AM SHAKING 🤯', time: '11:03 PM' },
  { id: '3', text: 'best birthday of my life, tell me who sent this', time: '6:42 PM' },
  { id: '4', text: "my roommates just barged in with a cake and flowers I'M DEAD 😂", time: '8:21 PM' },
  { id: '5', text: 'she said yes 💍🥹 the setup was PERFECT', time: '7:58 PM' },
  { id: '6', text: 'mom called me 6 times crying, worth every rupee', time: '10:06 PM' },
] as const;

export const HOW_IT_LANDS = [
  {
    step: '01',
    title: 'Lock the Target',
    body: 'Name, city, relationship. Tell us who gets the magic — even if you are miles away.',
  },
  {
    step: '02',
    title: 'Pick the Experience',
    body: 'Birthday Raid, Midnight Mission, Bollywood drop — choose the vibe that fits the moment.',
  },
  {
    step: '03',
    title: 'Add the Magic',
    body: 'A personal message plus notes for the Surprise Crew. Tiny details, huge impact.',
  },
  {
    step: '04',
    title: 'Launch the Mission',
    body: 'We brief a local crew. You stay wherever you are. They feel you in the room.',
  },
] as const;

export function getMissionById(id: string | undefined): Mission | undefined {
  if (!id) {
    return undefined;
  }
  return MISSIONS.find((mission) => mission.id === id);
}

export function missionFitsFilter(mission: Mission, filter: string): boolean {
  if (filter === 'All') {
    return true;
  }
  if (filter === 'Under ₹1000') {
    return mission.priceFrom < 1000;
  }
  if (filter === 'Premium ₹5000+') {
    return mission.priceFrom >= 5000;
  }
  return mission.tags.includes(filter) || mission.occasion === filter;
}
