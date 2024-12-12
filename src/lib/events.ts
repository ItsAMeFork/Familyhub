import { ref, push, update, get, remove } from 'firebase/database';
import { db } from './firebase';
import { createNotification } from './notifications';
import { CalendarEvent } from '../types';

export async function inviteToEvent(eventId: string, inviterId: string, inviteeId: string) {
  try {
    // Get event details first
    const eventRef = ref(db, `events/${eventId}`);
    const snapshot = await get(eventRef);
    if (!snapshot.exists()) {
      throw new Error('Event not found');
    }

    const event = snapshot.val() as CalendarEvent;

    // Update event attendees
    await update(ref(db, `events/${eventId}/attendees`), {
      [inviteeId]: 'pending'
    });

    // Create notification
    await createNotification(inviteeId, {
      title: 'New Event Invitation',
      message: `You've been invited to "${event.title}"`,
      type: 'event_invite',
      eventId: eventId
    });

    return true;
  } catch (error) {
    console.error('Error inviting to event:', error);
    throw error;
  }
}

export async function removeEvent(eventId: string) {
  try {
    await remove(ref(db, `events/${eventId}`));
    return true;
  } catch (error) {
    console.error('Error removing event:', error);
    throw error;
  }
}

export async function respondToEventInvite(
  eventId: string, 
  userId: string, 
  response: 'accepted' | 'declined'
) {
  try {
    // Update event attendance
    await update(ref(db, `events/${eventId}/attendees`), {
      [userId]: response
    });

    // Get event creator to notify them
    const eventRef = ref(db, `events/${eventId}`);
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const event = snapshot.val();
      const userName = (await get(ref(db, `users/${userId}/name`))).val() || 'Someone';
      
      // Notify event creator of response
      await createNotification(event.addedBy, {
        title: `Event ${response === 'accepted' ? 'Accepted' : 'Declined'}`,
        message: `${userName} has ${response} your event "${event.title}"`,
        type: 'event_response',
        eventId: eventId
      });
    }

    return true;
  } catch (error) {
    console.error('Error responding to event:', error);
    throw error;
  }
}