"use client";

import Image from "next/image";


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

  return (
    <div
      onClick={() => onClick?.(notification)}
      className={`flex items-center gap-4 px-4 py-3 ${
        showBorder ? "border-b border-gray-200" : ""
      } ${
        !isRead ? "bg-white" : "bg-gray-50"
      } hover:bg-gray-50 transition-colors cursor-pointer`}
    >
      <div className="w-14 h-14 relative flex-shrink-0">
        <Image
          src={avatar}
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
          {notification.message}
        </p>
      </div>
    </div>
  );
}