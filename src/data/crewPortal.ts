import { BadgeCheck, CalendarCheck, FileText, IndianRupee, type LucideIcon } from 'lucide-react-native';

export const CREW_STATS = '120+ crew members • 6 cities • ₹500–₹5,000 per surprise';

export const CREW_TOAST = 'Kabir just dropped a Bollywood Moment in Pune 🎉';

export const CREW_AVERAGE_PAYOUT = 1500;

export const CREW_ROLES = [
  { emoji: '🎂', name: 'Cake Artist', price: '₹800–₹3,000', description: 'Custom cakes delivered right on cue.' },
  { emoji: '🎤', name: 'Singer', price: '₹1,000–₹5,000', description: 'Live songs that make the moment.' },
  { emoji: '💃', name: 'Dancer', price: '₹1,000–₹4,000', description: 'Flash mobs and Bollywood numbers.' },
  { emoji: '📸', name: 'Photographer', price: '₹1,500–₹5,000', description: 'Capture the reveal as it happens.' },
  { emoji: '🎩', name: 'Magician', price: '₹1,200–₹4,500', description: 'Close-up tricks that hide the surprise.' },
  { emoji: '🚗', name: 'Driver', price: '₹500–₹1,500', description: 'Get people and gifts there on time.' },
  { emoji: '🙌', name: 'Crew Member', price: '₹500–₹1,500', description: 'Setup, cues, and on-ground support.' },
  { emoji: '🎈', name: 'Decorator', price: '₹800–₹3,500', description: 'Balloons, lights, and room makeovers.' },
] as const;

export const CREW_STEPS: readonly {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  { number: '01', icon: FileText, title: 'Apply Online', description: 'Share your skills, city, and availability in two minutes.' },
  { number: '02', icon: BadgeCheck, title: 'Get Verified', description: 'We check your ID and run a short call with our team.' },
  { number: '03', icon: CalendarCheck, title: 'Receive Orders', description: 'Accept surprises near you that fit your schedule.' },
  { number: '04', icon: IndianRupee, title: 'Show Up & Earn', description: 'Deliver the moment and get paid after every mission.' },
];

export const CREW_TRUST = [
  { emoji: '🔒', title: 'Identity Verified', description: 'Every crew member and customer is ID-checked before the first mission.' },
  { emoji: '⭐', title: 'Rated After Every Mission', description: 'Two-way ratings keep quality high and flag issues early.' },
  { emoji: '💸', title: 'Guaranteed Payment', description: 'Customers pay upfront, so your payout is secured before you arrive.' },
] as const;
