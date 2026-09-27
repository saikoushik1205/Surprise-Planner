import type {
  CrewNotification,
  CrewSurprise,
  CrewTask,
  TaskCategory,
  TaskStatus,
} from '@/data/crewTasks';

import type { CrewAssignment } from './crewService';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return new Date(value);
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatCrewDate(value: string) {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const diff = Math.round((startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / 86_400_000);
  if (diff === 0) {
    return 'Today';
  }
  if (diff === 1) {
    return 'Tomorrow';
  }
  if (diff === -1) {
    return 'Yesterday';
  }
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }
  const minutes = Math.round((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  const days = Math.round(hours / 24);
  if (days === 1) {
    return 'Yesterday';
  }
  return `${days} days ago`;
}

function taskStatusFromAssignment(status: string): TaskStatus {
  const key = status.trim().toLowerCase();
  if (key === 'completed') {
    return 'Completed';
  }
  if (key === 'in-progress' || key === 'launched') {
    return 'In Progress';
  }
  return 'Assigned';
}

function categoryFromAssignment(item: CrewAssignment): TaskCategory {
  const text = `${item.occasion} ${item.title} ${item.description}`.toLowerCase();
  if (text.includes('balloon')) {
    return 'balloon';
  }
  if (text.includes('decor')) {
    return 'decoration';
  }
  if (text.includes('gift')) {
    return 'gift';
  }
  if (text.includes('flower') || text.includes('romantic') || text.includes('anniversary')) {
    return 'flower';
  }
  if (text.includes('cake') || text.includes('birthday')) {
    return 'cake';
  }
  return 'reveal';
}

function venueFromAssignment(item: CrewAssignment) {
  const parts = [item.venue, item.landmark, item.city].map((value) => value?.trim()).filter(Boolean);
  if (parts.length > 0) {
    return [...new Set(parts)].join(' · ');
  }
  const line = item.description.split(/[.]/)[0]?.trim();
  return line && line.length < 80 ? line : 'Venue TBC';
}

function timeFromAssignment(item: CrewAssignment) {
  const match = item.description.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);
  return match?.[1] ?? 'TBD';
}

export function assignmentToTask(item: CrewAssignment): CrewTask {
  return {
    id: `task-${item.id}`,
    title: `Run ${item.occasion || item.title}`,
    surprise: item.title,
    date: formatCrewDate(item.date),
    time: timeFromAssignment(item),
    location: venueFromAssignment(item),
    status: taskStatusFromAssignment(item.status),
    category: categoryFromAssignment(item),
  };
}

export function assignmentToSurprise(item: CrewAssignment): CrewSurprise {
  const status = taskStatusFromAssignment(item.status);
  const done = status === 'Completed' ? 1 : 0;
  return {
    id: item.id,
    title: item.title,
    category: item.occasion || 'Surprise',
    forName: item.recipientName,
    date: formatCrewDate(item.date),
    time: timeFromAssignment(item),
    venue: venueFromAssignment(item),
    crewCount: 1,
    totalTasks: 1,
    doneTasks: done,
    taskStatuses: [status],
  };
}

export function assignmentToNotification(item: CrewAssignment): CrewNotification {
  const created = new Date(item.createdAt);
  const unread = !Number.isNaN(created.getTime()) && Date.now() - created.getTime() < 86_400_000;
  return {
    id: `alert-${item.id}`,
    icon: '🎉',
    title: 'New surprise assigned to you',
    body: `${item.title} for ${item.recipientName} at ${venueFromAssignment(item)}.`,
    time: formatCreatedAt(item.createdAt),
    unread,
  };
}

export function countTaskStats(tasks: CrewTask[]) {
  return {
    assigned: tasks.filter((task) => task.status === 'Assigned' || task.status === 'Accepted').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
    pending: tasks.filter((task) => task.status === 'Pending').length,
  };
}

export function splitTasks(tasks: CrewTask[]) {
  return {
    todayTasks: tasks.filter((task) => task.date === 'Today' && task.status !== 'Completed'),
    upcomingTasks: tasks.filter((task) => task.date !== 'Today' && task.status !== 'Completed'),
    completedTasks: tasks.filter((task) => task.status === 'Completed'),
  };
}
