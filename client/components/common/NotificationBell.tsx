'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { notificationApi } from '@/lib/api';
import type { Notification } from '@/types/Notifications';
import { log } from 'console';

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount(res.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.results || []);
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    setIsOpen(false);
    
    // Navigate based on notification type
    // if (notif.data?.order_id) {
    //   router.push(`/farmer/dashboard/orders/${notif.data.order_id}`);
    // } else if (notif.data?.mission_id) {
    //   router.push(`Transporter/dashboard/missions/${notif.data.mission_id}`);
    // } else if (notif.data?.product_id) {
    //   router.push(`/marketplace/${notif.data.product_id}`);
    //   console.log(`Navigating to product ${notif.data.product_id}`);
    // }
    
  };

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

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      order_placed: 'text-blue-500',
      order_confirmed: 'text-green-500',
      order_delivered: 'text-green-500',
      mission_created: 'text-purple-500',
      mission_accepted: 'text-green-500',
      mission_status: 'text-orange-500',
      price_changed: 'text-yellow-500',
      user_validated: 'text-green-500',
      user_rejected: 'text-red-500',
    };
    return colors[type] || 'text-primary';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
            <h3 className="font-bold text-sm">Notifications</h3>
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
                <p className="text-xs text-neutral-500 mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <span className="material-symbols-outlined text-3xl text-neutral-400 mb-2 block">notifications_off</span>
                <p className="text-sm text-neutral-500">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer transition-colors ${
                    !notif.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-lg ${getNotificationColor(notif.notification_type)}`}>
                      {getNotificationIcon(notif.notification_type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{notif.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-neutral-200 dark:border-neutral-700 text-center">
              <button
                onClick={() => router.push('/notifications')}
                className="text-xs text-neutral-500 hover:text-primary transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}