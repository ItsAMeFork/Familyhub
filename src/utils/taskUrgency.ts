import { differenceInDays } from 'date-fns';

export function getTaskUrgencyColor(lastCompletedAt: string | undefined, createdAt: string) {
  const date = lastCompletedAt ? new Date(lastCompletedAt) : new Date(createdAt);
  const daysSinceLastCompletion = differenceInDays(new Date(), date);

  if (daysSinceLastCompletion <= 2) {
    return 'bg-gray-800/50 hover:bg-gray-800/70 shadow-lg shadow-gray-900/50';
  } else if (daysSinceLastCompletion <= 5) {
    return 'bg-[#F7F754]/20 hover:bg-[#F7F754]/30 shadow-lg shadow-[#F7F754]/20';
  } else if (daysSinceLastCompletion <= 7) {
    return 'bg-[#B4F4F7]/20 hover:bg-[#B4F4F7]/30 shadow-lg shadow-[#B4F4F7]/20';
  } else {
    return 'bg-red-500/20 hover:bg-red-500/30 shadow-lg shadow-red-500/20';
  }
}