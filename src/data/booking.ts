export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Hyderabad: { lat: 17.385044, lng: 78.486671 },
  Mumbai: { lat: 19.07609, lng: 72.877426 },
  Bangalore: { lat: 12.971599, lng: 77.594563 },
  Delhi: { lat: 28.613939, lng: 77.209021 },
  Pune: { lat: 18.52043, lng: 73.856744 },
  Chennai: { lat: 13.08268, lng: 80.270718 },
};

export const CITY_DROPZONES: Record<string, { label: string; area: string; lat: number; lng: number }[]> = {
  Hyderabad: [
    { label: 'Jubilee Hills', area: 'Jubilee Hills', lat: 17.4308, lng: 78.407 },
    { label: 'Banjara Hills', area: 'Banjara Hills', lat: 17.414, lng: 78.435 },
    { label: 'Gachibowli', area: 'Gachibowli', lat: 17.44, lng: 78.348 },
    { label: 'Hitech City', area: 'Hitech City', lat: 17.4483, lng: 78.3915 },
  ],
  Pune: [
    { label: 'Koregaon Park', area: 'Koregaon Park', lat: 18.5362, lng: 73.8939 },
    { label: 'Kalyani Nagar', area: 'Kalyani Nagar', lat: 18.5463, lng: 73.9016 },
    { label: 'Baner', area: 'Baner', lat: 18.559, lng: 73.7868 },
    { label: 'Viman Nagar', area: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
  ],
  Mumbai: [
    { label: 'Bandra West', area: 'Bandra West', lat: 19.0596, lng: 72.8295 },
    { label: 'Andheri West', area: 'Andheri West', lat: 19.1363, lng: 72.8277 },
    { label: 'Powai', area: 'Powai', lat: 19.1176, lng: 72.906 },
    { label: 'Colaba', area: 'Colaba', lat: 18.9067, lng: 72.8147 },
  ],
  Bangalore: [
    { label: 'Indiranagar', area: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
    { label: 'Koramangala', area: 'Koramangala', lat: 12.9352, lng: 77.6245 },
    { label: 'Whitefield', area: 'Whitefield', lat: 12.9698, lng: 77.7499 },
    { label: 'Jayanagar', area: 'Jayanagar', lat: 12.925, lng: 77.5938 },
  ],
  Delhi: [
    { label: 'Saket', area: 'Saket', lat: 28.5245, lng: 77.2066 },
    { label: 'Connaught Place', area: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
    { label: 'Hauz Khas', area: 'Hauz Khas', lat: 28.5494, lng: 77.2001 },
    { label: 'Dwarka', area: 'Dwarka', lat: 28.5921, lng: 77.046 },
  ],
  Chennai: [
    { label: 'T Nagar', area: 'T Nagar', lat: 13.0418, lng: 80.2341 },
    { label: 'Adyar', area: 'Adyar', lat: 13.0067, lng: 80.257 },
    { label: 'Anna Nagar', area: 'Anna Nagar', lat: 13.085, lng: 80.21 },
    { label: 'Velachery', area: 'Velachery', lat: 12.9816, lng: 80.2209 },
  ],
};

export const BOOKING_CITIES = [
  { id: 'Pune', label: 'Pune, Maharashtra' },
  { id: 'Hyderabad', label: 'Hyderabad, Telangana' },
  { id: 'Mumbai', label: 'Mumbai, Maharashtra' },
  { id: 'Bangalore', label: 'Bangalore, Karnataka' },
  { id: 'Delhi', label: 'Delhi NCR' },
  { id: 'Chennai', label: 'Chennai, Tamil Nadu' },
] as const;

export const BOOKING_RELATIONSHIPS = [
  { id: 'Friend', label: 'Friend', emoji: '👯‍♂️' },
  { id: 'Partner', label: 'Partner', emoji: '❤️' },
  { id: 'Family', label: 'Family', emoji: '🏠' },
  { id: 'Colleague', label: 'Colleague', emoji: '💼' },
  { id: 'Secret Crush', label: 'Secret Crush', emoji: '🤫' },
  { id: 'Other', label: 'Other', emoji: '✨' },
] as const;

export const BOOKING_OCCASIONS = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', line: 'Cake, confetti, and surprises', popular: true },
  { id: 'anniversary', label: 'Anniversary', emoji: '❤️', line: 'Candles, private setup, nostalgia', popular: false },
  { id: 'celebration', label: 'Celebration', emoji: '🎉', line: 'Milestone party and celebration', popular: false },
  { id: 'proposal', label: 'Proposal / Romantic Date', emoji: '💍', line: 'Starlit ambient setting, roses', popular: false },
] as const;

export const BOOKING_CREWS = [
  {
    id: 'solo',
    label: 'Solo Delivery',
    badge: '1 operative',
    line: 'Quiet, discreet delivery with cake & secret card.',
    price: 299,
    recommended: false,
  },
  {
    id: 'duo',
    label: 'Duo Surprise',
    badge: '2 operatives',
    line: 'Small acoustic crew with cake & celebratory burst.',
    price: 499,
    recommended: false,
  },
  {
    id: 'crew',
    label: 'Surprise Crew',
    badge: '3 operatives',
    line: 'Stealth raid. High energy, confetti & guitar serenade.',
    price: 799,
    recommended: true,
  },
  {
    id: 'squad',
    label: 'Big Squad',
    badge: '5 operatives',
    line: 'Red carpet fanfare, paparazzi flash & viral spotlight.',
    price: 1299,
    recommended: false,
  },
] as const;

export const BOOKING_TRANSPORT = [
  {
    id: 'none',
    label: 'No Transport Needed',
    badge: 'Self',
    line: 'Crew travels by foot or own bike for ultra-local drops.',
    price: 0,
    hint: 'Included',
  },
  {
    id: 'bike',
    label: 'Bike / Auto',
    badge: 'Popular',
    line: 'Fast & nimble for apartment complexes & tight streets.',
    price: 149,
    hint: 'Active',
  },
  {
    id: 'cab',
    label: 'Surprise Cab',
    badge: 'Decorated',
    line: 'Arrives decorated with balloons and custom party ribbons.',
    price: 599,
    hint: 'Standard',
  },
  {
    id: 'van',
    label: 'Decorated Van',
    badge: 'VIP',
    line: 'Fairy lights, sound system & party poppers onboard.',
    price: 1299,
    hint: 'Grand',
  },
] as const;

export const BOOKING_TREATS = [
  {
    id: 'half-cake',
    label: 'Half kg Cake',
    line: 'Belgian chocolate truffle',
    badge: 'Eggless',
    price: 500,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
  },
  {
    id: 'kg-cake',
    label: '1kg Cake',
    line: 'Double size celebration cake',
    badge: 'Grand Size',
    price: 950,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80',
  },
  {
    id: 'cupcakes',
    label: 'Cupcakes',
    line: 'Cute, frosted & shareable',
    badge: '6 Pieces',
    price: 350,
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80',
  },
  {
    id: 'choco-box',
    label: 'Choco Box',
    line: 'Handcrafted truffles',
    badge: 'Assorted',
    price: 420,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80',
  },
] as const;

export const BOOKING_SLOTS = [
  { id: 'midnight', label: 'Midnight Drop', time: '11:55 PM – 12:15 AM', badge: 'Top Hit', clock: '23:55' },
  { id: 'evening', label: 'Evening Primetime', time: '7:00 PM – 8:30 PM', badge: '', clock: '19:00' },
  { id: 'morning', label: 'Morning Energy', time: '9:00 AM – 10:30 AM', badge: '', clock: '09:00' },
  { id: 'custom', label: 'Custom Exact Minute', time: 'Synchronized precision landing', badge: '', clock: '' },
] as const;

export const MAGIC_PROMPTS = [
  { id: 'rahman', emoji: '🎵', label: '90s Telugu AR Rahman', text: ' Obsessed with 90s Telugu AR Rahman playlists.' },
  { id: 'biryani', emoji: '🍛', label: 'Dum Biryani Fanatic', text: ' Craves midnight Hyderabadi Dum Biryani.' },
  { id: 'quiet', emoji: '🔇', label: 'No Loud Poppers', text: ' Strictly no loud confetti poppers or mega-horns.' },
] as const;

export const BOOKING_STEPS = [
  { id: 'target', stage: 1, label: 'Target', next: '/book/moment' },
  { id: 'moment', stage: 2, label: 'Moment', next: '/book/crew' },
  { id: 'crew', stage: 3, label: 'Crew', next: '/book/transport' },
  { id: 'transport', stage: 3, label: 'Transport', next: '/book/treats' },
  { id: 'treats', stage: 3, label: 'Treats', next: '/book/magic' },
  { id: 'magic', stage: 4, label: 'Magic', next: '/book/when' },
  { id: 'when', stage: 5, label: 'When', next: '/book/where' },
  { id: 'where', stage: 5, label: 'Where', next: '/book/review' },
  { id: 'review', stage: 6, label: 'Review', next: '/confirmation' },
] as const;

export type BookingDraft = {
  recipientName: string;
  city: string;
  relationship: string;
  occasion: string;
  crewTier: string;
  transport: string;
  treats: string[];
  skipTreats: boolean;
  loves: string;
  message: string;
  messageMode: 'card' | 'spoken';
  date: string;
  dateChoice: 'today' | 'tomorrow' | 'custom';
  slot: string;
  time: string;
  address: string;
  landmark: string;
  area: string;
};

export function quoteBooking(draft: Pick<BookingDraft, 'crewTier' | 'transport' | 'treats' | 'skipTreats'>) {
  const lines: { name: string; price: number }[] = [];
  const crew = BOOKING_CREWS.find((item) => item.id === draft.crewTier);
  const transport = BOOKING_TRANSPORT.find((item) => item.id === draft.transport);
  if (crew) {
    lines.push({ name: crew.label, price: crew.price });
  }
  if (transport && transport.price > 0) {
    lines.push({ name: transport.label, price: transport.price });
  }
  if (!draft.skipTreats) {
    for (const id of draft.treats) {
      const treat = BOOKING_TREATS.find((item) => item.id === id);
      if (treat) {
        lines.push({ name: treat.label, price: treat.price });
      }
    }
  }
  const total = lines.reduce((sum, line) => sum + line.price, 0);
  return { lines, total, items: lines.length };
}

export function bookingDateLabel(choice: BookingDraft['dateChoice'], date: string) {
  if (choice === 'today') {
    return 'Today';
  }
  if (choice === 'tomorrow') {
    return formatShortDate(shiftDate(1));
  }
  return date;
}

export function shiftDate(days: number) {
  const next = new Date();
  next.setDate(next.getDate() + days);
  return toIsoDate(next);
}

export function toIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatShortDate(iso: string) {
  const parsed = parseIsoDate(iso);
  if (!parsed) {
    return iso;
  }
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function parseIsoDate(iso: string) {
  const parsed = new Date(`${iso}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatWeekday(iso: string) {
  const parsed = parseIsoDate(iso);
  if (!parsed) {
    return '';
  }
  return parsed.toLocaleDateString('en-IN', { weekday: 'short' });
}

export function formatMonthYear(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function buildUpcomingDays(count = 14) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const iso = toIsoDate(date);
    return {
      iso,
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      label: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
    };
  });
}

export function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const pad = first.getDay();
  const today = toIsoDate(new Date());
  const cells: { iso: string | null; day: number | null; past: boolean }[] = [];
  for (let i = 0; i < pad; i += 1) {
    cells.push({ iso: null, day: null, past: true });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = toIsoDate(new Date(year, month, day));
    cells.push({ iso, day, past: iso < today });
  }
  return cells;
}

export function parseClock(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) {
    return { hour: 7, minute: 0, period: 'PM' as const };
  }
  const raw = Number(match[1]);
  const minute = Number(match[2]);
  const period = raw >= 12 ? ('PM' as const) : ('AM' as const);
  const hour = raw % 12 === 0 ? 12 : raw % 12;
  return { hour, minute, period };
}

export function toClock(hour: number, minute: number, period: 'AM' | 'PM') {
  const raw = period === 'AM' ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
  return `${String(raw).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function formatClockLabel(value: string) {
  const { hour, minute, period } = parseClock(value);
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
}
