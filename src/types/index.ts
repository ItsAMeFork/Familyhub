export interface MealOption {
  id: string;
  name: string;
  description: string;
  votes: { [key: string]: boolean };
  addedBy: string;
  imageUrl?: string;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  estimatedTime: number;
  addedBy: string;
  description?: string;
  attendees: {
    [key: string]: 'pending' | 'accepted' | 'declined';
  };
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string | null;
  status: 'todo' | 'doing' | 'done';
  lastCompletedAt?: string;
  createdAt: string;
}

export type NotificationType = 'event_invite' | 'event_response' | 'expense_invite';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: NotificationType;
  eventId?: string;
  expenseId?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  paidBy?: string;
  paidAt?: string;
  addedBy: string;
  createdAt: string;
  category?: string;
  description?: string;
  isRecurring: boolean;
  recurringType: 'monthly' | 'one-time';
  lastRecurringReset?: string;
}