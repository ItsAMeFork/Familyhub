import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/auth/useAuth';
import { Notification } from '../../types';
import { respondToEventInvite } from '../../lib/events';

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    const notificationsRef = ref(db, `notifications/${user.uid}`);
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsList = Object.entries(data).map(([id, notification]: [string, any]) => ({
          id,
          ...notification
        }));
        setNotifications(notificationsList.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      } else {
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleEventResponse = async (notification: Notification, response: 'accepted' | 'declined') => {
    if (!user || !notification.eventId) return;

    try {
      await respondToEventInvite(notification.eventId, user.uid, response);
      await removeNotification(notification.id);
    } catch (error) {
      console.error('Error responding to event:', error);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;
    await update(ref(db, `notifications/${user.uid}/${id}`), { read: true });
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const updates = notifications.reduce((acc, notification) => ({
      ...acc,
      [`${notification.id}/read`]: true
    }), {});
    await update(ref(db, `notifications/${user.uid}`), updates);
  };

  const removeNotification = async (id: string) => {
    if (!user) return;
    await remove(ref(db, `notifications/${user.uid}/${id}`));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 md:p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors relative"
      >
        <Bell className="w-4 h-4 md:w-5 md:h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-content fixed left-3 right-3 md:left-auto md:right-0 md:w-80 mt-2 max-h-[28rem] overflow-y-auto rounded-xl bg-gray-800 shadow-xl border border-gray-700">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-100">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-500 hover:text-emerald-400"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="divide-y divide-gray-700">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-300">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 ${!notification.read ? 'bg-gray-700/30' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-100">{notification.title}</h4>
                      <p className="text-sm text-gray-300 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>

                      {notification.type === 'event_invite' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEventResponse(notification, 'accepted')}
                            className="px-3 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleEventResponse(notification, 'declined')}
                            className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-emerald-500 hover:text-emerald-400"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}