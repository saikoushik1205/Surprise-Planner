import type { PlanDraft } from '@/context/PlanContext';
import { BOOKING_OCCASIONS, BOOKING_SLOTS, quoteBooking } from '@/data/booking';
import { PLAN_OCCASIONS, quotePlan } from '@/data/planner';
import type { SurpriseInput } from '@/types/surprise';

export function quoteForDraft(draft: PlanDraft) {
  return draft.crewTier ? quoteBooking(draft) : quotePlan(draft);
}

export function buildLaunchInput(draft: PlanDraft): { input: SurpriseInput; revealText: string } {
  const quote = quoteForDraft(draft);
  const occasion =
    BOOKING_OCCASIONS.find((item) => item.id === draft.occasion) ??
    PLAN_OCCASIONS.find((item) => item.id === draft.occasion);
  const slot = BOOKING_SLOTS.find((item) => item.id === draft.slot);
  const revealText =
    draft.revealText.trim() || `Pack your bags — ${occasion?.label ?? 'a surprise'} is waiting.`;

  return {
    revealText,
    input: {
      title: `${occasion?.label ?? 'Surprise'} for ${draft.recipientName.trim()}`,
      recipient: draft.recipientName.trim(),
      occasion: occasion?.label ?? 'Other',
      date: draft.date,
      budget: quote.total,
      description: [
        draft.relationship ? `${draft.relationship} surprise.` : '',
        draft.group ? 'Group surprise. Friends can chip in from ₹500.' : '',
        [draft.address, draft.area, draft.city].filter(Boolean).join(', '),
        slot ? `${slot.label} · ${slot.time}` : `Time ${draft.time}.`,
        draft.loves ? `Intel: ${draft.loves}` : '',
        draft.message || draft.cakeMessage ? `Note: ${draft.message || draft.cakeMessage}` : '',
        revealText,
      ]
        .filter(Boolean)
        .join(' '),
      status: 'Launched',
      city: draft.city,
    },
  };
}
