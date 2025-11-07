'use client';

import { useNotifications } from '../notification/NotificationContext'; // Adjust path

export default function NotificationList() {
  // Get all state and functions from the global hook!
  const { notifications, notifCount, markRead, loadMore } = useNotifications();

  return (
    <div className="p-4 w-80 text-black"> {/* Set text to black for readability */}
      <h3 className="mb-2 font-bold">Unread notifications: {notifCount}</h3>

      <div className="max-h-96 overflow-y-auto"> {/* Make list scrollable */}
        {notifications.length === 0 && (
          <p className="text-gray-500">No new notifications.</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className="border border-gray-300 rounded p-2 mb-2"
            style={{ opacity: n.read ? 0.5 : 1 }}
          >
            <p className="font-bold">{n.title}</p>
            <p className="text-sm">{n.message}</p>

            {!n.read && (
              <button
                onClick={() => markRead(n.id)}
                className="mt-1 px-2 py-1 text-xs bg-blue-500 text-white rounded"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={loadMore}
        className="mt-2 w-full px-3 py-1 bg-green-500 text-white rounded"
      >
        Load more
      </button>
    </div>
  );
}