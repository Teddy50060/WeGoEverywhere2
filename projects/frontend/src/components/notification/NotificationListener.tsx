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
    socket.on('initial_notifications', (data: NotificationUser[]) => {
      setNotifications(data);
    });

    // 3️⃣ รับ notification ใหม่แบบ push
    socket.on('new_notification', (notif: NotificationUser) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    // 4️⃣ อัปเดตเมื่อ mark read
    socket.on('notification_updated', ({ id, read }: { id: number; read: boolean }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read } : n))
      );
    });

    // ✅ cleanup
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // 5️⃣ mark read
  const markRead = (notifId: number) => {
    socketRef.current?.emit('mark_read', { notificationUserId: notifId });
  };

  return (
    <div>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            opacity: n.read ? 0.5 : 1,
            border: '1px solid #ccc',
            padding: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <strong>{n.title || 'No Title'}</strong> ({n.fromService || 'Unknown'})
          <p>{n.message || 'No message'}</p>
          {!n.read && <button onClick={() => markRead(n.id)}>Mark read</button>}
        </div>
      ))}

    </div>
  );
}
