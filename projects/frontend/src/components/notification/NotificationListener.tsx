'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/configurations/config/socket';

// need fix
type NotificationUser = {
  id: number; // notification_user.id
  userId: number;
  notificationId: number;
  read: boolean;
  message: string; // จาก template
  title: string;
  fromService: string;
};

type NotificationUserWithTemplate = NotificationUser & {
  title: string;
  message: string;
  fromService: string;
};

export default function NotificationListener({ userId }: { userId: number }) {
  const [notifications, setNotifications] = useState<NotificationUserWithTemplate[]>([]);

  // ✅ ใช้ | null เพราะตอนแรกยังไม่มี socket
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 1️⃣ Connect socket
    const socket = io(SOCKET_URL, {
      query: { userId },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    // 2️⃣ รับ initial notifications (unread)
    socket.on('initial_notifications', (data: NotificationUserWithTemplate[]) => {
      setNotifications(data);
    });

    // 3️⃣ รับ notification ใหม่แบบ push
    socket.on('new_notification', (notif: NotificationUserWithTemplate) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    // 4️⃣ อัปเดตเมื่อ mark read
    socket.on('notification_updated', ({ notificationId, read }: { notificationId: number; read: boolean }) => {
      console.log("notification_updated", { notificationId, read });
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === notificationId ? { ...n, read } : n))
      );
    });

    socket.on('error', (err: string) => {
      console.log('Socket error:', err);
    });

    // ✅ cleanup
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // 5️⃣ mark read
  const markRead = (notificationUserId: number) => {
    // console.log("emit mark_read", { notificationUserId });
    socketRef.current?.emit('mark_read', { notificationUserId });
  };

  return (
    <div>
      {notifications.map((n) => (
        <div
          key={n.id}
          className="border border-gray-300 rounded p-2 mb-2"
          style={{ opacity: n.read ? 0.5 : 1 }}
        >
          <p><strong>ID:</strong> {n.id}</p>
          <p><strong>User ID:</strong> {n.userId}</p>
          <p><strong>Notification ID:</strong> {n.notificationId}</p>
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
