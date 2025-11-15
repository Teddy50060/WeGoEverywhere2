'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/configurations/config/socket';
import { toast } from 'react-hot-toast';

import { Notification } from '@/components/notification/notificationCard'; // Adjust path

// 1. Define the context type with all functions
interface NotificationContextType {
  notifications: Notification[];
  notifCount: number;
  markRead: (notificationId: number) => void;
  loadMore: () => void;
  reloadNotifications: () => void; // For resetting the page
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationPayload {
  limit: number;
  offset: number;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifCount, setNotifCount] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);

  // --- THIS IS THE NEW HACK ---
  // This ref remembers the 'offset' we just requested
  const offsetRef = useRef<number>(0);
  // ----------------------------

  const pathname = usePathname();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notification server');
      getNotifications(10, 0); // Load initial data
    });

    // ... (socket.on('notification_count'), socket.on('new_notification'), etc.)
    // Your 'new_notification' listener with the pop-up blocker is perfect.
    
    socket.on('new_notification', (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
      setNotifCount((prev) => prev + 1);
      const blockedPaths = ['/login', '/notification']; 
      const isOnBlockedPage = blockedPaths.some(path => pathname.startsWith(path));
      if (!isOnBlockedPage) {
        toast.success(notif.title || 'New Notification!', {
          icon: '🔔',
        });
      }
    });

    socket.on(
      'notification_updated',
      ({ notificationId, read }: { notificationId: number; read: boolean }) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read } : n))
        );
      }
    );

    // --- 2. THIS IS THE MODIFIED LISTENER ---
    // It now receives the simple array from the backend
    socket.on('notifications_page', (notifs: Notification[]) => {
      // Check our ref to see what we just asked for
      if (offsetRef.current === 0) {
        // This was a RELOAD (page 1). Replace the list.
        setNotifications(notifs);
      } else {
        // This was a LOAD MORE (page 2+). Append to the list.
        setNotifications((prev) => [...prev, ...notifs]);
      }
    });
    // ----------------------------------------

    socket.on('error', (err: string) => {
      console.log('Socket error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [pathname]);

  const markRead = (notificationId: number) => {
    socketRef.current?.emit('mark_read', { notificationId });
    const notif = notifications.find((n) => n.id === notificationId);
    if (notif && !notif.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setNotifCount((prev) => Math.max(prev - 1, 0));
    }
  };

  // --- 3. THIS IS THE MODIFIED 'getNotifications' ---
  const getNotifications = (limit: number, offset: number) => {
    // We set the ref *right before* we ask the server
    offsetRef.current = offset;
    const payload: NotificationPayload = { limit, offset };
    socketRef.current?.emit('get_notifications', payload);
  };

  const loadMore = () => {
    getNotifications(10, notifications.length);
  };

  const reloadNotifications = () => {
    getNotifications(10, 0); // This will set offsetRef.current = 0
  };

  const value = {
    notifications,
    notifCount,
    markRead,
    loadMore,
    reloadNotifications,
  };

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