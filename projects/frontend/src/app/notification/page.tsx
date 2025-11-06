"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { Navbar } from "@/components/navbar/Navbar";
import { NotificationCard, Notification } from "@/components/notification/notificationCard";
import toast from "react-hot-toast";

// Mock data ที่ตรงกับ schema
const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    title: "New Event Available",
    fromService: "event",
    message: "Check out the latest event in your area!",
    read: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    title: "Unread Event Notification",
    fromService: "event",
    message: "Don't miss this upcoming event",
    read: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 1,
    title: "System Update",
    fromService: "system",
    message: "Your profile has been updated successfully",
    read: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    userId: 1,
    title: "Ammy C.",
    fromService: "user",
    message: "hello ...",
    read: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function NotificationPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: API placeholder
      
      
      // Mock: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
      
      setHasMore(true);
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      setError(error?.message || "Failed to load notifications");
      setNotifications([]);
      setHasMore(false);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call for pagination
      

      // Mock pagination
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (page >= 2) {
        setHasMore(false);
        return;
      }
      
      const moreNotifications: Notification[] = [
        {
          id: notifications.length + 1,
          userId: 1,
          title: "John D.",
          fromService: "user",
          message: "New message...",
          read: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: notifications.length + 2,
          userId: 1,
          title: "New Event",
          fromService: "event",
          message: "Another event notification",
          read: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setNotifications([...notifications, ...moreNotifications]);
      setPage(page + 1);
    } catch (error: any) {
      console.error("Failed to load more:", error);
      setHasMore(false);
      toast.error("Failed to load more notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // TODO: Implement notification click handler
   
    
    console.log("Notification clicked:", notification);
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

          {/* Loading state for initial fetch */}
          {loading && notifications.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            </div>
          ) : error && notifications.length === 0 ? (
            /* Error State with Retry */
            <section className="relative z-0 mx-4 bg-white rounded-[60px] shadow py-16">
              <div className="flex flex-col items-center justify-center px-8">
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto w-20 h-20 text-red-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1">
                    Failed to load notifications
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={fetchNotifications}
                    className="h-11 px-8 rounded-full bg-[#EB6223] text-white font-semibold hover:bg-[#d55a1f] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </section>
          ) : notifications.length > 0 ? (
            /* Has notifications */
            <>
              <section className="relative z-0 bg-white shadow-md mb-6 overflow-hidden">
                {/* Notifications List */}
                <div>
                  {notifications.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      showBorder={index < notifications.length - 1}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              </section>

              {/* Load More Button or All Caught Up Message */}
              {hasMore ? (
                <div className="flex justify-center px-8 pb-6">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="h-11 w-full rounded-full bg-[#C5E99B] border-2 border-black text-base font-semibold hover:bg-[#b5d98b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "Load more"}
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
            /* Empty State - No notifications yet */
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