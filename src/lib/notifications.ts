import { ref, push } from 'firebase/database';
import { db } from './firebase';
import { NotificationType } from '../types';

interface NotificationData {
  title: string;
  message: string;
  type?: NotificationType;
  eventId?: string;
  expenseId?: string;
  timestamp?: string;
  read?: boolean;
}

export async function createNotification(userId: string, notification: NotificationData) {
  try {
    await push(ref(db, `notifications/${userId}`), {
      ...notification,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: notification.read || false
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}