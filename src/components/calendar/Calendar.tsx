import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { db } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../lib/auth/useAuth';
import { CalendarForm } from './CalendarForm';
import { CalendarEvent } from './CalendarEvent';

export function Calendar() {
  const { events = [], loading } = useStore();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    estimatedTime: 60,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await push(ref(db, 'events'), {
        ...newEvent,
        addedBy: user.uid,
        createdAt: new Date().toISOString(),
        attendees: {
          [user.uid]: 'accepted' // Automatically add creator as accepted
        }
      });

      setNewEvent({ title: '', start: '', estimatedTime: 60, description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Family Calendar</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="button button-primary p-2 rounded-full"
          >
            <Plus size={24} />
          </button>
        </div>

        {showForm && (
          <CalendarForm
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No events scheduled. Add your first event!
          </div>
        ) : (
          events.map((event) => (
            <CalendarEvent key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}