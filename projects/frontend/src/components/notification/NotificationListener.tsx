'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/configurations/config/socket';
import { NotificationsDto } from '@/lib/api';

export default function NotificationListener({ userId }: { userId: number }) {
  // for test -> <NotificationListener userId={15} />
  const [notifications, setNotifications] = useState<NotificationsDto[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      query: { userId },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    socket.on('initial_notifications', (data: NotificationsDto[]) => {
      setNotifications(data);
    });

    socket.on('new_notification', (notif: NotificationsDto) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    socket.on('notification_updated', ({ notificationId, read }: { notificationId: number; read: boolean }) => {
      // console.log("notification_updated", { notificationId, read });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read } : n))
      );
    });

    socket.on('error', (err: string) => {
      console.log('Socket error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const markRead = (notificationId: number) => {
    // console.log("emit mark_read", { notificationUserId });
    socketRef.current?.emit('mark_read', { notificationId });
  };

  return (
    <div>
      {notifications.map((n) => (
        <div
          key={n.id}
          className="border border-gray-300 rounded p-2 mb-2"
          style={{ opacity: n.read ? 0.5 : 1 }}
        >
          <p><strong>Notification ID:</strong> {n.id}</p>
          <p><strong>User ID:</strong> {n.userId}</p>
          <p><strong>Read:</strong> {n.read ? "true" : "false"}</p>
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
    </div>
  );
}
