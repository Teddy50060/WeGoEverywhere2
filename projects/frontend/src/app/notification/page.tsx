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
    <div className="relative w-full max-w-[393px] mx-auto min-h-screen bg-[#FFF8F0] flex flex-col">
      <main className="flex-1 py-1 font-alt pb-24">
        <div className="mx-auto w-full">
          {/* Back Button + Title */}
          <div className="mt-1 mb-6 flex items-center gap-4 px-4">
            <button
              aria-label="Back"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-[#EB6223] flex items-center justify-center shadow hover:scale-105 transition flex-shrink-0"
            >
              <FiArrowLeft className="text-[#000000]" size={17} />
            </button>
            <h1 className="text-2xl font-semibold text-[#1f1f1f]">
              Notifications
            </h1>
          </div>

          {/* Notifications Card */}
          {notifications.length > 0 ? (
            <>
              <section className="relative z-0 bg-white shadow-md mb-6 overflow-hidden">
                {/* Notifications List */}
                <div>
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`flex items-center gap-4 px-4 py-3 ${
                        index < notifications.length - 1 ? "border-b border-gray-200" : ""
                      } ${
                        !notification.read ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      <div className="w-14 h-14 relative flex-shrink-0">
                        <Image
                          src={notification.avatar}
                          alt={notification.title}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate">
                          {notification.title}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {notification.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Load More Button or All Caught Up Message */}
              {hasMore ? (
                <div className="flex justify-center px-8 pb-6">
                  <button
                    onClick={loadMore}
                    className="h-11 w-full rounded-full bg-[#C5E99B] border-2 border-black text-base font-semibold hover:bg-[#b5d98b] transition-colors"
                  >
                    Load more
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-8 pb-6 pt-4">
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700 mb-1">
                      All notifications have been loaded
                    </p>
                    <p className="text-sm text-gray-500">
                      You are up to date
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State - No notifications */
            <section className="relative z-0 mx-4 bg-white rounded-[60px] shadow py-16">
              <div className="flex flex-col items-center justify-center px-8">
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto w-20 h-20 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1">
                    No notifications yet
                  </p>
                  <p className="text-sm text-gray-500">
                    You will be notified when there are updates
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Navbar at bottom with same positioning as home page */}
      <footer className="mt-auto sticky bottom-0 w-full px-1 pb-[env(safe-area-inset-bottom)] z-50">
        <Navbar />
      </footer>
    </div>
  );
}