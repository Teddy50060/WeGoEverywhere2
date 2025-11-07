'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/configurations/config/socket';
import { NotificationsDto } from '@/lib/api';
import { toast, Toaster } from 'react-hot-toast'; // Import toast

// Define the shape of the context data
interface NotificationContextType {
  notifications: NotificationsDto[];
  notifCount: number;
  markRead: (notificationId: number) => void;
  loadMore: () => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Define the payload interface (as in your file)
interface NotificationPayload {
  limit: number;
  offset: number;
}

// Create the Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationsDto[]>([]);
  const [notifCount, setNotifCount] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);

  // All your socket logic from useEffect goes here
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notification server');
      getNotifications(10, 0); // Load first 10
    });

    // Realtime events
    socket.on('notification_count', (count: number) => {
      console.log('Received notification_count:', count);
      setNotifCount(count);
    });

    socket.on('new_notification', (notif: NotificationsDto) => {
      console.log('Received new_notification:', notif);
      setNotifications((prev) => [notif, ...prev]);
      setNotifCount((prev) => prev + 1);

      // --- THIS IS YOUR GOAL #1 ---
      // Show an immediate pop-up toast
      toast.success(notif.title || 'New Notification!', {
        icon: '🔔',
      });
      // -----------------------------
    });

    socket.on(
      'notification_updated',
      ({
        notificationId,
        read,
      }: {
        notificationId: number;
        read: boolean;
      }) => {
        console.log('Received notification_updated:', notificationId, read);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read } : n))
        );
        // Only decrement if a notification was marked as read
        if (read) {
          setNotifCount((prev) => Math.max(prev - 1, 0));
        }
      }
    );

    socket.on('notifications_page', (notifs: NotificationsDto[]) => {
      console.log('Received notifications_page:', notifs.length);
      setNotifications((prev) => [...prev, ...notifs]); // append page
    });

    socket.on('error', (err: string) => {
      console.log('Socket error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Mark notification as read
  const markRead = (notificationId: number) => {
    socketRef.current?.emit('mark_read', { notificationId });
  };

  // Get paginated notifications
  const getNotifications = (limit: number, offset: number) => {
    const payload: NotificationPayload = { limit, offset };
    socketRef.current?.emit('get_notifications', payload);
  };

  // Load more
  const loadMore = () => {
    getNotifications(10, notifications.length);
  };

  // The value provided to consumers
  const value = { notifications, notifCount, markRead, loadMore };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Add the Toaster component here so it's globally available */}
    </NotificationContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}