type RevealRecord = {
  recipientName: string;
  revealText: string;
};

const reveals = new Map<string, RevealRecord>();
const tracks = new Map<string, number>();
let lastTrackId = 'demo';

const DEMO_REVEAL: RevealRecord = {
  recipientName: 'Priya',
  revealText: 'Pack your bags, date night at 8 PM!',
};

export function saveLaunch(id: string, reveal: RevealRecord) {
  reveals.set(id, reveal);
  tracks.set(id, 1);
  lastTrackId = id;
}

export function getReveal(id: string): RevealRecord {
  if (id === 'demo') {
    return DEMO_REVEAL;
  }
  return reveals.get(id) ?? { recipientName: 'Them', revealText: 'A surprise is waiting.' };
}

export function getTrackStep(id: string): number {
  if (id === 'demo') {
    return tracks.get(id) ?? 1;
  }
  return tracks.get(id) ?? 1;
}

export function setTrackStep(id: string, step: number) {
  tracks.set(id, step);
  lastTrackId = id;
}

export function getLastTrackId(): string {
  return lastTrackId;
}
