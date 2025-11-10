'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/configurations/config/socket';
import { NotificationsDto } from '@/lib/api';

interface NotificationPayload {
  limit: number;
  offset: number;
}

export default function NotificationListener() {
  const [notifications, setNotifications] = useState<NotificationsDto[]>([]);
  const [notifCount, setNotifCount] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);

  // Connect socket
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true, // ส่ง JWT cookie อัตโนมัติ
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notification server');
      getNotifications(10, 0); // โหลดหน้าแรก 10 ตัว
    });

    // Realtime events
    socket.on('notification_count', (count: number) => {
      setNotifCount(count);
    });

    socket.on('new_notification', (notif: NotificationsDto) => {
      setNotifications((prev) => [notif, ...prev]);
      setNotifCount((prev) => prev + 1); // เพิ่ม count
    });

    socket.on('notification_updated', ({ notificationId, read }: { notificationId: number; read: boolean }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read } : n))
      );
      if (read) setNotifCount((prev) => Math.max(prev - 1, 0)); // ลด count
    });

    socket.on('notifications_page', (notifs: NotificationsDto[]) => {
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

  return (
    <div>
      <h3 className="mb-2 font-bold">Unread notifications: {notifCount}</h3>

      {notifications.map((n) => (
        <div
          key={n.id}
          className="border border-gray-300 rounded p-2 mb-2"
          style={{ opacity: n.read ? 0.5 : 1 }}
        >
          <p><strong>Notification ID:</strong> {n.id}</p>
          <p><strong>User ID:</strong> {n.userId}</p>
          <p><strong>Read:</strong> {n.read ? 'true' : 'false'}</p>
          <p><strong>Title:</strong> {n.title}</p>
          <p><strong>Message:</strong> {n.message}</p>
          <p><strong>From Service:</strong> {n.fromService}</p>

          {!n.read && (
            <button
              onClick={() => markRead(n.id)}
              className="mt-1 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Mark read
            </button>
          )}
        </div>
      ))}

      <button
        onClick={loadMore}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
      >
        Load more
      </button>
    </div>
  );
}
