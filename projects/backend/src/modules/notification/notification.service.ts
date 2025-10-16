import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { Notifications } from '@backend/src/database/schema/notifications.schema';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async getNotifs(userId: number, limit: number = 10, offset: number = 0) {
    return await this.notificationRepo.getNotifs(userId, limit, offset);
  }

  async markAsRead(notificationId: number) {
    return await this.notificationRepo.markAsRead(notificationId);
  }

  async getNotifCount(userId: number, unreadOnly = true): Promise<number> {
    const unread = await this.notificationRepo.getNotifCount(userId, unreadOnly);
    return unread;
  }
  
  async broadcastNotification(
    userIds: number[],
    templateData: { title: string; fromService?: string; message: string },
  ): Promise<Notifications[]> {
    // ใช้ Promise.all เพื่อ insert notification ให้ทุก user พร้อมกัน
    const userNotifications: Notifications[] = await Promise.all(
      userIds.map((userId) =>
        this.notificationRepo.createNotification(
          userId,
          templateData,
        )
      )
    );

    return userNotifications;
  }
}
