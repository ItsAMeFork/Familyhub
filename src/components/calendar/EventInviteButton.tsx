import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { inviteToEvent } from '../../lib/events';

interface EventInviteButtonProps {
  eventId: string;
  memberId: string;
}

export function EventInviteButton({ eventId, memberId }: EventInviteButtonProps) {
  const [inviting, setInviting] = useState(false);
  const { familyMembers } = useStore();
  const { user } = useAuth();

  const member = familyMembers.find(m => m.id === memberId);
  if (!member || !user) return null;

  const handleInvite = async () => {
    if (inviting) return;
    setInviting(true);

    try {
      await inviteToEvent(eventId, user.uid, memberId);
    } catch (error) {
      console.error('Failed to invite member:', error);
    } finally {
      setInviting(false);
    }
  };

  return (
    <button
      onClick={handleInvite}
      disabled={inviting}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors disabled:opacity-50"
    >
      <span>{member.avatar}</span>
      <span className="text-sm">{member.name}</span>
      {inviting ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="text-lg">+</span>
      )}
    </button>
  );
}