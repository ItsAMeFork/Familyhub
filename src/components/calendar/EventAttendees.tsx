import React from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { CalendarEvent } from '../../types';
import { EventInviteButton } from './EventInviteButton';

interface EventAttendeesProps {
  event: CalendarEvent;
}

export function EventAttendees({ event }: EventAttendeesProps) {
  const { familyMembers, loading } = useStore();
  const { user } = useAuth();

  if (loading || !user) return null;

  const isCreator = user.uid === event.addedBy;
  const uninvitedMembers = familyMembers.filter(
    member => !event.attendees?.[member.id] && member.id !== user.uid
  );

  if (!isCreator || uninvitedMembers.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <p className="text-sm font-medium text-gray-300 mb-2">Invite others:</p>
      <div className="flex flex-wrap gap-2">
        {uninvitedMembers.map((member) => (
          <EventInviteButton
            key={member.id}
            eventId={event.id}
            memberId={member.id}
          />
        ))}
      </div>
    </div>
  );
}