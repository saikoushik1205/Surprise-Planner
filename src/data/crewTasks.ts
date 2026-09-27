export type TaskStatus = 'Assigned' | 'Accepted' | 'In Progress' | 'Pending' | 'Completed';
export type TaskCategory = 'cake' | 'flower' | 'gift' | 'decoration' | 'reveal' | 'balloon';

export type CrewTask = {
  id: string;
  title: string;
  surprise: string;
  date: string;
  time: string;
  location: string;
  status: TaskStatus;
  category: TaskCategory;
};

export type CrewSurprise = {
  id: string;
  title: string;
  category: string;
  forName: string;
  date: string;
  time: string;
  venue: string;
  crewCount: number;
  totalTasks: number;
  doneTasks: number;
  taskStatuses: TaskStatus[];
};

export type CrewNotification = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

// ─── Tasks ──────────────────────────────────────────────────────────────────

export const MOCK_TASKS: CrewTask[] = [
  // Today
  { id: 't1', title: 'Pick up birthday cake', surprise: 'Birthday Surprise', date: 'Today', time: '5:30 PM', location: 'Sweet Magic', status: 'Assigned', category: 'cake' },
  { id: 't2', title: 'Pick up flower bouquet', surprise: 'Birthday Surprise', date: 'Today', time: '6:00 PM', location: 'Blossom Florists', status: 'Assigned', category: 'flower' },
  { id: 't3', title: 'Pick up gift package', surprise: 'Birthday Surprise', date: 'Today', time: '6:30 PM', location: 'The Gift Studio', status: 'Accepted', category: 'gift' },
  { id: 't4', title: 'Set up decorations at venue', surprise: 'Birthday Surprise', date: 'Today', time: '7:15 PM', location: 'The Skyline Terrace', status: 'Pending', category: 'decoration' },
  { id: 't5', title: 'Coordinate surprise reveal', surprise: 'Birthday Surprise', date: 'Today', time: '8:00 PM', location: 'The Skyline Terrace', status: 'Pending', category: 'reveal' },
  // Upcoming
  { id: 't6', title: 'Pick up anniversary cake', surprise: 'Anniversary Surprise', date: 'Tomorrow', time: '11:00 AM', location: "Cake O'Clock", status: 'Assigned', category: 'cake' },
  { id: 't7', title: 'Deliver anniversary flowers', surprise: 'Anniversary Surprise', date: 'Tomorrow', time: '12:30 PM', location: 'The Pearl Hotel', status: 'Assigned', category: 'flower' },
  // Completed
  { id: 't8', title: 'Pick up birthday cake', surprise: 'Kiddo Birthday', date: 'Yesterday', time: '4:00 PM', location: 'Sweet Magic', status: 'Completed', category: 'cake' },
  { id: 't9', title: 'Set up party decorations', surprise: 'Kiddo Birthday', date: 'Yesterday', time: '5:30 PM', location: 'Fun Zone Play Area', status: 'Completed', category: 'decoration' },
  { id: 't10', title: 'Pick up flowers for proposal', surprise: 'Proposal Surprise', date: '25 Sep', time: '6:00 PM', location: 'Blossom Florists', status: 'Completed', category: 'flower' },
];

export const TODAY_TASKS = MOCK_TASKS.filter((t) => t.date === 'Today');
export const UPCOMING_TASKS = MOCK_TASKS.filter((t) => t.date !== 'Today' && t.status !== 'Completed');
export const COMPLETED_TASKS = MOCK_TASKS.filter((t) => t.status === 'Completed');

// ─── Surprises ───────────────────────────────────────────────────────────────

export const MOCK_SURPRISES: CrewSurprise[] = [
  {
    id: 's1',
    title: 'Birthday Surprise',
    category: 'Birthday',
    forName: 'Ananya',
    date: 'Today',
    time: '8:00 PM',
    venue: 'The Skyline Terrace',
    crewCount: 3,
    totalTasks: 5,
    doneTasks: 0,
    taskStatuses: ['Assigned', 'Assigned', 'Accepted', 'In Progress', 'Pending'],
  },
  {
    id: 's2',
    title: 'Anniversary Surprise',
    category: 'Anniversary',
    forName: 'Kavya & Rohan',
    date: 'Tomorrow',
    time: '1:00 PM',
    venue: 'The Pearl Hotel',
    crewCount: 1,
    totalTasks: 2,
    doneTasks: 0,
    taskStatuses: ['Assigned', 'Assigned'],
  },
  {
    id: 's3',
    title: 'Kiddo Birthday',
    category: 'Birthday',
    forName: 'Aarav',
    date: 'Yesterday',
    time: '6:00 PM',
    venue: 'Fun Zone Play Area',
    crewCount: 1,
    totalTasks: 2,
    doneTasks: 2,
    taskStatuses: ['Completed', 'Completed'],
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: CrewNotification[] = [
  { id: 'n1', icon: '🧑‍🤝‍🧑', title: 'New task assigned to you', body: "You've been assigned to pick up the birthday cake from Sweet Magic by 5:30 PM today.", time: '10 min ago', unread: true },
  { id: 'n2', icon: '⏰', title: 'Cake pickup due in 30 minutes', body: 'Your pickup at Sweet Magic is due at 5:30 PM. Make sure you\'re on the way.', time: '25 min ago', unread: true },
  { id: 'n3', icon: '🔄', title: 'Priya started the decoration task', body: 'Priya Reddy has marked "Set up decorations" as In Progress.', time: '1 hour ago', unread: true },
  { id: 'n4', icon: '📋', title: 'Customer updated surprise instructions', body: 'Sai updated the instructions for "Birthday Surprise". Please review before pickup.', time: '2 hours ago', unread: false },
  { id: 'n5', icon: '⭐', title: 'You earned a 5-star rating!', body: 'The Sharma family gave you 5 stars for the Anniversary Surprise last week.', time: 'Yesterday', unread: false },
];

// ─── Performance ─────────────────────────────────────────────────────────────

export const CREW_PERFORMANCE = {
  rating: 4.8,
  totalJobs: 187,
  completed: 179,
  crewId: 'CRW-00142',
  joinedDate: 'March 2024',
  city: 'Hyderabad',
};

export const TASK_CATEGORY_EMOJI: Record<TaskCategory, string> = {
  cake: '🎂',
  flower: '🌸',
  gift: '🎁',
  decoration: '✨',
  reveal: '🌟',
  balloon: '🎈',
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  Assigned: { label: 'Assigned', color: '#ff2d78', bg: 'rgba(255,45,120,0.12)' },
  Accepted: { label: 'Accepted', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
  'In Progress': { label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  Pending: { label: 'Pending', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
  Completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};
