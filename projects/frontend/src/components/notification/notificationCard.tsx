"use client";

import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export interface Notification {
  id: number;
  userId: number;
  title: string;
  fromService: string | null;
  message: string;
  read: boolean | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface NotificationCardProps {
  notification: Notification;
  showBorder?: boolean;
  onClick?: (notification: Notification) => void;
}

// Helper function to get avatar based on service
const getAvatarFromService = (fromService?: string | null): string => {
  // TODO: Map service to avatar image
  switch (fromService) {
    case "event":
      return "/images/event-icon.png";
    case "system":
      return "/images/system-icon.png";
    case "user":
    default:
      return "/images/avatar-placeholder.png";
  }
};

// Helper function to determine notification type
const getNotificationType = (fromService?: string | null): "EVENT" | "SYSTEM" | "USER" => {
  if (fromService?.toLowerCase().includes("event")) return "EVENT";
  if (fromService?.toLowerCase().includes("system")) return "SYSTEM";
  return "USER";
};

export function NotificationCard({
  notification,
  showBorder = true,
  onClick,
}: NotificationCardProps) {
  const avatar = getAvatarFromService(notification.fromService);
  const isRead = notification.read ?? false;
  const timeAgo = dayjs(notification.createdAt).fromNow();

// return (
//     <div
//       onClick={() => onClick?.(notification)}
//       className={`flex items-center gap-4 px-4 py-3 ${
//         showBorder ? "border-b border-gray-200" : ""
//       } ${
//         !isRead ? "bg-white" : "bg-gray-50"
//       } hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
//         // --- THIS IS THE FIX ---
//         // If it's read, make it 60% opaque.
//         isRead ? "opacity-60" : "opacity-100"
//       }`}
//     >
//       <div className="w-14 h-14 relative flex-shrink-0">
//         <Image
//           src={avatar}
//           alt={notification.title}
//           fill
//           className="rounded-full object-cover"
//         />
//       </div>
//       <div className="flex-1 min-w-0">
//         <h3 className="font-semibold text-gray-900 text-base truncate">
//           {notification.title}
//         </h3>
//         <p className="text-gray-400 text-sm truncate">
//           {notification.message}
//         </p>
//       </div>
//     </div>
//   );
return (
  <div
    onClick={() => onClick?.(notification)}
    className={`flex items-center gap-4 px-5 py-4 
      transition-all duration-200 cursor-pointer shadow-sm
      ${showBorder ? "border-b border-gray-100" : ""}
      ${!isRead ? "bg-white hover:bg-[#F8FAFC]" : "bg-gray-50 hover:bg-gray-100"}
      ${isRead ? "opacity-75" : "opacity-100"}
    `}
  >
    <div className="relative w-14 h-14 flex-shrink-0">
      <Image
        src={avatar}
        alt={notification.title}
        fill
        className="rounded-full object-cover ring-2 ring-offset-2 ring-gray-100"
      />
      {!isRead && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white" />
      )}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1">
        {notification.title}
      </h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2 leading-snug">
        {notification.message}
      </p>
      <span className="text-gray-400 text-xs mt-1 block">{timeAgo}</span>
    </div>
  </div>
);

}