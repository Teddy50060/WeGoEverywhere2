"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";
import { Navbar } from "@/components/navbar/Navbar";

interface Notification {
  id: number;
  type: "EVENT" | "UNREAD_EVENT" | "SYSTEM" | "USER";
  title: string;
  detail: string;
  avatar: string;
  read?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "EVENT",
    title: "[EVENT_NAME]",
    detail: "detail...",
    avatar: "/images/avatar-placeholder.png",
    read: true,
  },
  {
    id: 2,
    type: "UNREAD_EVENT",
    title: "[UNREAD_EVENT]",
    detail: "detail...",
    avatar: "/images/avatar-placeholder.png",
    read: false,
  },
  {
    id: 3,
    type: "SYSTEM",
    title: "[SYSTEM]",
    detail: "detail...",
    avatar: "/images/avatar-placeholder.png",
    read: true,
  },
  {
    id: 4,
    type: "USER",
    title: "Ammy C.",
    detail: "hello ...",
    avatar: "/images/avatar-placeholder.png",
    read: true,
  },
  {
    id: 5,
    type: "USER",
    title: "Ammy C.",
    detail: "hello ...",
    avatar: "/images/avatar-placeholder.png",
    read: true,
  },
  {
    id: 6,
    type: "USER",
    title: "Ammy C.",
    detail: "hello ...",
    avatar: "/images/avatar-placeholder.png",
    read: true,
  },
  {
    id: 7,
    type: "EVENT",
    title: "[EVENT_NAME]",
    detail: "detail...",
    avatar: "/images/avatar-placeholder.png",
    read: true,
  },
];

export default function NotificationPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    // Simulate loading more notifications
    if (page >= 2) {
      setHasMore(false);
      return;
    }
    
    const moreNotifications: Notification[] = [
      {
        id: notifications.length + 1,
        type: "USER",
        title: "John D.",
        detail: "New message...",
        avatar: "/images/avatar-placeholder.png",
        read: true,
      },
      {
        id: notifications.length + 2,
        type: "EVENT",
        title: "[NEW_EVENT]",
        detail: "detail...",
        avatar: "/images/avatar-placeholder.png",
        read: false,
      },
    ];

    setNotifications([...notifications, ...moreNotifications]);
    setPage(page + 1);
  };

  return (
    <div>
      <main className="min-h-screen py-1 font-alt bg-[#FFF8F0] pb-32">
        <div className="mx-auto w-full px-2">
          {/* Back + Title pill */}
          <div className="mt-10 mb-4 relative z-10">
            <button
              aria-label="Back"
              onClick={() => router.back()}
              className="absolute left-0 top-1/2 -translate-y-[60%] z-20 w-10 h-10 rounded-full bg-[#EB6223] flex items-center justify-center shadow hover:scale-105 transition"
            >
              <FiArrowLeft className="text-[#000000]" size={17} />
            </button>
            <div className="flex justify-center">
              <div className="absolute -bottom-6 z-10 px-10 py-3 rounded-[60px] bg-[#FFDCD5] shadow-[0_6px_0_rgba(0,0,0,0.07)]">
                <span className="text-2xl font-semibold text-[#1f1f1f]">
                  Notifications
                </span>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <section className="relative z-0 mx-4 bg-white rounded-t-[60px] shadow">
            {/* Notifications List - Scrollable */}
            <div className="overflow-y-auto pt-12" style={{ maxHeight: "calc(100vh - 300px)" }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center gap-4 p-4 border-b border-gray-200 ${
                    !notification.read ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                >
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={notification.avatar}
                      alt={notification.title}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{notification.title}</h3>
                    <p className="text-gray-500 text-sm truncate">{notification.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center py-6">
                <button
                  onClick={loadMore}
                  className="px-32 py-4 bg-[#C5E99B] rounded-full text-lg font-semibold hover:bg-[#b5d98b] transition-colors"
                >
                  Load more
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Navbar />
    </div>
  );
}