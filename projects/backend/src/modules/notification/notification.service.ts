import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  // ---------------- USER NOTIFICATIONS ----------------

  async getUnread(userId: number) {
    return await this.notificationRepo.getUnread(userId);
  }

  async markAsRead(notificationUserId: number) {
    return await this.notificationRepo.markAsRead(notificationUserId);
  }

  async assignNotificationToUser(userId: number, templateId: number) {
    return await this.notificationRepo.createUserNotification({
      userId,
      notificationId: templateId,
    });
  }

  // ---------------- TEMPLATES ----------------

  async createTemplate(title: string, fromService: string, message: string) {
    return await this.notificationRepo.createTemplate({
      title,
      fromService,
      message,
    });
  }

  async updateTemplate(templateId: number, data: Partial<{ title: string; fromService: string; message: string }>) {
    return await this.notificationRepo.updateTemplate(templateId, data);
  }

  async getTemplate(templateId: number) {
    return await this.notificationRepo.getTemplate(templateId);
  }

  // ---------------- BROADCAST ----------------

  async broadcastNotification(templateData: { title: string; fromService: string; message: string }, userIds: number[]) {
    // 1. สร้าง template
    const template = await this.notificationRepo.createTemplate(templateData);

    // 2. สร้าง notification_user สำหรับ user ทุกคน
    const userNotifications = await Promise.all(
      userIds.map((userId) =>
        this.notificationRepo.createUserNotification({
          userId,
          notificationId: template.id,
        }),
      ),
    );

    return { template, userNotifications };
  }
}
