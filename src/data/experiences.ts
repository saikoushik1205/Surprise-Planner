export const EXPERIENCE_CATEGORIES = [
  'All',
  'Birthday',
  'Romantic',
  'Anniversary',
  'Midnight',
  'Graduation',
  'Friends',
  'Family',
  'Celebration',
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export type PriceFilter = 'any' | 'under-1000' | '1000-2000' | '2000-3500' | '3500-plus';
export type CrewFilter = 'any' | '1-2' | '3-4' | '5-plus';
export type RatingFilter = 'any' | '4' | '4.5' | '4.8';
export type ExperienceSort = 'recommended' | 'popular' | 'rating' | 'price-asc' | 'price-desc';

export type Experience = {
  slug: string;
  title: string;
  description: string;
  story: string;
  happens: string[];
  customizeNote: string;
  image: string;
  badge: string;
  rating: number;
  reviews: number;
  durationMins: number;
  crew: number;
  crewLabel: string;
  priceFrom: number;
  categories: Exclude<ExperienceCategory, 'All'>[];
  tags: string[];
  includes: string[];
  popular?: boolean;
};

export const EXPERIENCES: Experience[] = [
  {
    slug: 'birthday-raid',
    title: 'Birthday Raid',
    description: 'A loud, joyful crew drops in with cake, chaos, and birthday energy.',
    story:
      'Your people walk in thinking it is a normal day. Three minutes later the room is cake, poppers, and a recap video they will replay all week.',
    happens: [
      'Crew arrives with the cake and kit already staged.',
      'A timed burst of poppers, hats, and a short chant.',
      'Candid video of the first 90 seconds, then a clean exit.',
    ],
    customizeNote: 'Swap the cake flavour, rewrite the chant, and pick how loud the entrance should be.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    badge: 'Most Popular',
    rating: 4.9,
    reviews: 142,
    durationMins: 30,
    crew: 3,
    crewLabel: '3-person crew',
    priceFrom: 999,
    categories: ['Birthday', 'Friends', 'Celebration'],
    tags: ['Birthday', 'Friends', 'Funny', 'Cake'],
    includes: ['Chocolate cake', 'Party poppers', 'Neon party hats', 'Candid video reel'],
    popular: true,
  },
  {
    slug: 'midnight-mission',
    title: 'Midnight Mission',
    description: 'A late-night moment — quiet, cinematic, and impossible to forget.',
    story:
      'After midnight, two operatives land at the door with a truffle cake, a glow halo, and a soft chime. No crowd. Just the reveal.',
    happens: [
      'Stealth arrival after 12:00 AM.',
      'Doorstep setup with cake, glow balloons, and a chime.',
      'A short filmed moment, then they disappear.',
    ],
    customizeNote: 'Set the arrival window, the song on the chime, and how private the reveal should stay.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    badge: 'Midnight Special',
    rating: 4.95,
    reviews: 210,
    durationMins: 25,
    crew: 2,
    crewLabel: '2 stealth operatives',
    priceFrom: 1299,
    categories: ['Midnight', 'Romantic', 'Anniversary'],
    tags: ['Midnight', 'Romantic', 'Stealth'],
    includes: ['Stealth doorstep raid', 'Belgian truffle cake', 'Glowing balloon halo', 'Bluetooth chime entry'],
    popular: true,
  },
  {
    slug: 'romantic-surprise',
    title: 'Romantic Surprise',
    description: 'Roses, a handwritten letter, and a crew that knows how to set a scene.',
    story:
      'Petals, a letter in your voice, and a live acoustic line. Built for the person who would never plan this for themselves.',
    happens: [
      'Crew dresses the space with roses and micro lights.',
      'The letter is handed over, then the first song starts.',
      'Photos of the setup and the first reaction.',
    ],
    customizeNote: 'Write the letter, pick the song, and choose roses, candles, or both.',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80',
    badge: 'Heartfelt',
    rating: 5,
    reviews: 98,
    durationMins: 40,
    crew: 3,
    crewLabel: '3-person crew',
    priceFrom: 2499,
    categories: ['Romantic', 'Anniversary', 'Celebration'],
    tags: ['Romantic', 'Anniversary', 'Roses', 'Live music'],
    includes: ['50 red roses', 'Handwritten letter', 'Acoustic serenade', 'Fairy lights'],
  },
  {
    slug: 'bollywood-moment',
    title: 'Bollywood Flashmob',
    description: 'A singer, a song, and main-character energy in the middle of the street.',
    story:
      'Five dancers break into a number around them. Confetti, a custom mix, and a 4K recap of the chaos.',
    happens: [
      'Crew seeds the space as regular people.',
      'The first beat drops and the flashmob starts.',
      'Confetti close, then a recap clip on the way out.',
    ],
    customizeNote: 'Pick the track, the lyric drop, and how public the performance should feel.',
    image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
    badge: 'High Energy',
    rating: 4.85,
    reviews: 64,
    durationMins: 35,
    crew: 5,
    crewLabel: '5 dancers & crew',
    priceFrom: 3499,
    categories: ['Celebration', 'Friends', 'Graduation'],
    tags: ['Flashmob', 'Public', 'Music', 'Go Big'],
    includes: ['Street dance surprise', 'Custom song mix', 'Confetti cannon', '4K recap'],
    popular: true,
  },
  {
    slug: 'nri-love-package',
    title: 'NRI Love Package',
    description: 'For the ones abroad — a full family moment back home, handled end to end.',
    story:
      'You stay on a two-way tablet while a host walks your parents through cake, sweets, and a framed portrait.',
    happens: [
      'Host briefs the family and sets the tablet link.',
      'Cake and sweets land as you join live.',
      'A framed portrait and a recap they can keep.',
    ],
    customizeNote: 'Choose who speaks first, the sweets, and the message on the portrait.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800&q=80',
    badge: 'Family Favorite',
    rating: 4.98,
    reviews: 312,
    durationMins: 45,
    crew: 3,
    crewLabel: '2 crew + tech host',
    priceFrom: 4999,
    categories: ['Family', 'Anniversary', 'Celebration'],
    tags: ['Family', 'NRI', 'Live relay'],
    includes: ['Two-way tablet link', 'Family hosting', 'Artisanal sweets & cake', 'Framed portrait'],
    popular: true,
  },
  {
    slug: 'proposal-setup',
    title: 'Proposal Setup',
    description: 'The most important yes of their life — staged, timed, and secretly filmed.',
    story: 'A quiet set, a hidden camera, and a crew that knows when to vanish so the question is only yours.',
    happens: [
      'Set is dressed before they arrive.',
      'You walk in. The crew holds for the question.',
      'Secret film of the yes, delivered privately.',
    ],
    customizeNote: 'Choose the set, the hidden camera angle, and the first line they hear.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    badge: 'Heartfelt',
    rating: 4.92,
    reviews: 77,
    durationMins: 50,
    crew: 4,
    crewLabel: '4-person crew',
    priceFrom: 5999,
    categories: ['Romantic', 'Anniversary', 'Celebration'],
    tags: ['Proposal', 'Romantic', 'Premium'],
    includes: ['Staged set', 'Secret film crew', 'Florals', 'Private recap'],
  },
  {
    slug: 'facemask-raid',
    title: 'Facemask Raid',
    description: 'A wildcard crew in custom masks of their face — cake, chaos, and a reaction that writes itself.',
    story: 'Friends in their likeness storm the room. It is ridiculous, loud, and somehow still sweet.',
    happens: [
      'Masks and cake are ready off-site.',
      'The raid hits in under a minute.',
      'Photos of the first look, then a clean exit.',
    ],
    customizeNote: 'Send a clear face photo, pick the joke line, and choose indoor or outdoor.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    badge: 'High Energy',
    rating: 4.7,
    reviews: 41,
    durationMins: 25,
    crew: 4,
    crewLabel: '4-person crew',
    priceFrom: 3999,
    categories: ['Birthday', 'Friends', 'Graduation'],
    tags: ['Birthday', 'Funny', 'Friends', 'Wildcard'],
    includes: ['Custom face masks', 'Cake', 'Raid chant', 'Photo burst'],
  },
  {
    slug: 'magic-moment',
    title: 'Magic Moment',
    description: 'A close-up magic set built around them — premium, personal, and quietly spectacular.',
    story: 'A magician works their name, a keepsake, and one impossible close into a short private show.',
    happens: [
      'A quiet corner is set.',
      'A 15-minute close-up set with their story woven in.',
      'A keepsake card they take home.',
    ],
    customizeNote: 'Share three personal details. We fold them into the final trick.',
    image: 'https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=800&q=80',
    badge: 'Midnight Special',
    rating: 4.8,
    reviews: 53,
    durationMins: 30,
    crew: 1,
    crewLabel: '1 magician',
    priceFrom: 5999,
    categories: ['Anniversary', 'Birthday', 'Celebration'],
    tags: ['Magic', 'Private', 'Premium'],
    includes: ['Close-up set', 'Personalised finale', 'Keepsake card'],
  },
  {
    slug: 'graduation-sendoff',
    title: 'Graduation Send-off',
    description: 'Caps, a banner, and a crew that turns the last lecture into a send-off.',
    story: 'Friends, a printed banner, and a short speech moment staged as they step out of class.',
    happens: [
      'Banner and caps wait just off the path.',
      'The reveal hits as they exit.',
      'Group photos and a 20-second recap.',
    ],
    customizeNote: 'Add the batch year, a roast line, and who gets the first hug.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    badge: 'High Energy',
    rating: 4.6,
    reviews: 29,
    durationMins: 20,
    crew: 3,
    crewLabel: '3-person crew',
    priceFrom: 1799,
    categories: ['Graduation', 'Friends', 'Celebration'],
    tags: ['Graduation', 'Friends', 'Banner'],
    includes: ['Custom banner', 'Caps', 'Photo recap'],
  },
];

export const PRICE_OPTIONS: { id: PriceFilter; label: string }[] = [
  { id: 'any', label: 'Any price' },
  { id: 'under-1000', label: 'Under ₹1,000' },
  { id: '1000-2000', label: '₹1,000–₹2,000' },
  { id: '2000-3500', label: '₹2,000–₹3,500' },
  { id: '3500-plus', label: '₹3,500+' },
];

export const CREW_OPTIONS: { id: CrewFilter; label: string }[] = [
  { id: 'any', label: 'Any crew' },
  { id: '1-2', label: '1–2' },
  { id: '3-4', label: '3–4' },
  { id: '5-plus', label: '5+' },
];

export const RATING_OPTIONS: { id: RatingFilter; label: string }[] = [
  { id: 'any', label: 'Any rating' },
  { id: '4', label: '4+' },
  { id: '4.5', label: '4.5+' },
  { id: '4.8', label: '4.8+' },
];

export const SORT_OPTIONS: { id: ExperienceSort; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'popular', label: 'Popular' },
  { id: 'rating', label: 'Rating' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
];

export type ExperienceFilters = {
  query: string;
  category: ExperienceCategory;
  price: PriceFilter;
  crew: CrewFilter;
  rating: RatingFilter;
  sort: ExperienceSort;
};

export const DEFAULT_EXPERIENCE_FILTERS: ExperienceFilters = {
  query: '',
  category: 'All',
  price: 'any',
  crew: 'any',
  rating: 'any',
  sort: 'recommended',
};

export function getExperienceBySlug(slug: string | undefined): Experience | undefined {
  if (!slug) {
    return undefined;
  }
  return EXPERIENCES.find((item) => item.slug === slug);
}

function matchesPrice(item: Experience, price: PriceFilter): boolean {
  if (price === 'any') {
    return true;
  }
  if (price === 'under-1000') {
    return item.priceFrom < 1000;
  }
  if (price === '1000-2000') {
    return item.priceFrom >= 1000 && item.priceFrom <= 2000;
  }
  if (price === '2000-3500') {
    return item.priceFrom > 2000 && item.priceFrom <= 3500;
  }
  return item.priceFrom > 3500;
}

function matchesCrew(item: Experience, crew: CrewFilter): boolean {
  if (crew === 'any') {
    return true;
  }
  if (crew === '1-2') {
    return item.crew <= 2;
  }
  if (crew === '3-4') {
    return item.crew >= 3 && item.crew <= 4;
  }
  return item.crew >= 5;
}

function matchesRating(item: Experience, rating: RatingFilter): boolean {
  if (rating === 'any') {
    return true;
  }
  if (rating === '4') {
    return item.rating >= 4;
  }
  if (rating === '4.5') {
    return item.rating >= 4.5;
  }
  return item.rating >= 4.8;
}

function matchesQuery(item: Experience, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  const haystack = [
    item.title,
    item.description,
    item.story,
    item.badge,
    ...item.tags,
    ...item.categories,
    ...item.includes,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterExperiences(items: Experience[], filters: ExperienceFilters): Experience[] {
  const next = items.filter((item) => {
    const categoryOk = filters.category === 'All' || item.categories.includes(filters.category);
    return (
      categoryOk &&
      matchesQuery(item, filters.query) &&
      matchesPrice(item, filters.price) &&
      matchesCrew(item, filters.crew) &&
      matchesRating(item, filters.rating)
    );
  });

  const sorted = [...next];
  if (filters.sort === 'price-asc') {
    sorted.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (filters.sort === 'price-desc') {
    sorted.sort((a, b) => b.priceFrom - a.priceFrom);
  } else if (filters.sort === 'rating') {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (filters.sort === 'popular') {
    sorted.sort((a, b) => b.reviews - a.reviews);
  } else {
    sorted.sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)) || b.rating - a.rating);
  }
  return sorted;
}

export function countActiveFilters(filters: ExperienceFilters): number {
  return [filters.price !== 'any', filters.crew !== 'any', filters.rating !== 'any'].filter(Boolean).length;
}

export async function loadExperiences(): Promise<Experience[]> {
  await new Promise((resolve) => setTimeout(resolve, 420));
  if (typeof globalThis !== 'undefined' && (globalThis as { __EXPERIENCES_FAIL?: boolean }).__EXPERIENCES_FAIL) {
    throw new Error('Could not load experiences.');
  }
  return EXPERIENCES;
}
