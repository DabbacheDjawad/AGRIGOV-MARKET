'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notificationApi } from '@/lib/api';
import type { Notification } from '@/types/Notifications';

export default function NotificationList() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getNotifications(page);
      if (page === 1) {
        setNotifications(res.results);
      } else {
        setNotifications(prev => [...prev, ...res.results]);
      }
      setHasMore(!!res.next);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

//   const handleNotificationClick = (notif: Notification) => {
//     markAsRead(notif.id);
//     if (notif.data?.order_id) {
//       router.push(`/orders/${notif.data.order_id}`);
//     } else if (notif.data?.mission_id) {
//       router.push(`/missions/${notif.data.mission_id}`);
//     }
//   };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      order_placed: 'shopping_bag',
      order_confirmed: 'check_circle',
      order_delivered: 'task_alt',
      mission_created: 'local_shipping',
      mission_accepted: 'check_circle',
      mission_status: 'sync',
      price_changed: 'payments',
      user_validated: 'verified',
      user_rejected: 'cancel',
    };
    return icons[type] || 'notifications';
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading && page === 1 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            <p className="text-sm text-neutral-500 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl">
            <span className="material-symbols-outlined text-4xl text-neutral-400 mb-2 block">notifications_off</span>
            <p className="text-neutral-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
            //   onClick={() => handleNotificationClick(notif)}
              className={`p-4 bg-white dark:bg-neutral-800 rounded-xl border cursor-pointer transition-colors ${
                !notif.is_read
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-2xl text-primary">
                  {getNotificationIcon(notif.notification_type)}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold">{notif.title}</h3>
                    <span className="text-xs text-neutral-400 whitespace-nowrap">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {notif.message}
                  </p>
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                )}
              </div>
            </div>
          ))
        )}

        {hasMore && (
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
            className="w-full py-3 text-center text-sm text-primary hover:underline disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
}