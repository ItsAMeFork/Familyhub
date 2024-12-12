import React from 'react';
import { format, parseISO, addMinutes } from 'date-fns';
import { CalendarEvent as CalendarEventType } from '../../types';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { EventAttendees } from './EventAttendees';

interface CalendarEventProps {
  event: CalendarEventType;
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const { familyMembers } = useStore();
  const { user } = useAuth();
  const startTime = parseISO(event.start);
  const endTime = addMinutes(startTime, event.estimatedTime || 60);

  const isCreator = user?.uid === event.addedBy;
  const attendanceStatus = event.attendees?.[user?.uid || ''];

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-100">{event.title}</h3>
      <div className="text-sm text-gray-300 mt-1">
        <p>{format(startTime, 'PPP')}</p>
        <p>
          {format(startTime, 'p')} - {format(endTime, 'p')}
          <span className="text-gray-400 ml-2">
            ({event.estimatedTime} minutes)
          </span>
        </p>
      </div>
      {event.description && (
        <p className="text-gray-300 mt-2">{event.description}</p>
      )}

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {familyMembers.map((member) => {
            const status = event.attendees?.[member.id];
            if (!status) return null;
            
            return (
              <div
                key={member.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  status === 'accepted'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : status === 'declined'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-gray-700/50 text-gray-400'
                }`}
              >
                <span>{member.avatar}</span>
                <span className="text-sm">{member.name}</span>
                <span className="text-xs opacity-75">
                  {status === 'accepted' ? '✓ Going' : status === 'declined' ? '✗ Not going' : '? Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isCreator && <EventAttendees event={event} />}
    </div>
  );
}