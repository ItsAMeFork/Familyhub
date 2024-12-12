import React from 'react';
import { CalendarEvent } from '../../types';

interface CalendarFormProps {
  newEvent: Omit<CalendarEvent, 'id' | 'addedBy' | 'attendees'>;
  setNewEvent: (event: Omit<CalendarEvent, 'id' | 'addedBy' | 'attendees'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CalendarForm({ newEvent, setNewEvent, onSubmit }: CalendarFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
        <input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="input w-full"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Time (minutes)</label>
          <input
            type="number"
            value={newEvent.estimatedTime}
            onChange={(e) => setNewEvent({ ...newEvent, estimatedTime: parseInt(e.target.value) })}
            className="input w-full"
            min="1"
            max="1440"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="input w-full"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="button button-primary w-full"
      >
        Add Event
      </button>
    </form>
  );
}