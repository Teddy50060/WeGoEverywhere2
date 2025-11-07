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
import { toast } from 'react-hot-toast';

// --- 1. IMPORT YOUR NEW INTERFACE ---
import { Notification } from '@/components/notification/notificationCard'; // Adjust path

// --- 2. UPDATE THE CONTEXT TYPE ---
interface NotificationContextType {
  notifications: Notification[]; // Use Notification
  notifCount: number;
  markRead: (notificationId: number) => void;
  loadMore: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationPayload {
  limit: number;
  offset: number;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  // --- 3. UPDATE THE STATE ---
  const [notifications, setNotifications] = useState<Notification[]>([]); // Use Notification
  const [notifCount, setNotifCount] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notification server');
      getNotifications(10, 0);
    });

    socket.on('notification_count', (count: number) => {
      setNotifCount(count);
    });

    // --- 4. UPDATE SOCKET EVENT TYPES ---
    socket.on('new_notification', (notif: Notification) => { // Use Notification
      setNotifications((prev) => [notif, ...prev]);
      setNotifCount((prev) => prev + 1);
      toast.success(notif.title || 'New Notification!', {
        icon: '🔔',
      });
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
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read } : n))
        );
        if (read) {
          setNotifCount((prev) => Math.max(prev - 1, 0));
        }
      }
    );

    socket.on('notifications_page', (notifs: Notification[]) => { // Use Notification
      setNotifications((prev) => [...prev, ...notifs]);
    });

    socket.on('error', (err: string) => {
      console.log('Socket error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markRead = (notificationId: number) => {
    socketRef.current?.emit('mark_read', { notificationId });
  };

  const getNotifications = (limit: number, offset: number) => {
    const payload: NotificationPayload = { limit, offset };
    socketRef.current?.emit('get_notifications', payload);
  };

  const loadMore = () => {
    getNotifications(10, notifications.length);
  };

  const value = { notifications, notifCount, markRead, loadMore };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}