// src/notifications/notification.repo.ts
import { Inject, Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { DbType } from '@backend/src/database/connection';

import {
  notificationUsers,
  NotificationUser,
  CreateNotificationUserInput,
  UpdateNotificationUserInput,
} from '../../database/schema/notification_users.schema';

import {
  notificationTemplates,
  NotificationTemplate,
  CreateNotificationTemplateInput,
  UpdateNotificationTemplateInput,
} from '../../database/schema/notification_templates.schema';

export type NotificationUserWithTemplate = NotificationUser & {
  title: string;
  message: string;
  fromService: string;
};

@Injectable()
export class NotificationRepository {
  constructor(
    @Inject('DatabaseConnection') private readonly db: DbType,
  ) {}

  // ================== USERS ==================

  async getUnread(userId: number): Promise<(NotificationUserWithTemplate)[]>  {
    const results = await this.db
      .select({
        id: notificationUsers.id,
        userId: notificationUsers.userId,
        notificationId: notificationUsers.notificationId,
        read: notificationUsers.read,
        createdAt: notificationUsers.createdAt,
        updatedAt: notificationUsers.updatedAt,
        title: notificationTemplates.title,
        message: notificationTemplates.message,
        fromService: notificationTemplates.fromService,
      })
      .from(notificationUsers)
      .leftJoin(notificationTemplates, eq(notificationTemplates.id, notificationUsers.notificationId))
      .where(and(
        eq(notificationUsers.userId, userId),
        eq(notificationUsers.read, false),
      ));

    // map ให้ null → empty string
    return results.map(r => ({
      ...r,
      title: r.title ?? '',
      message: r.message ?? '',
      fromService: r.fromService ?? '',
    }));
  }

  async markAsRead(notificationUserId: number) {
    return await this.db
      .update(notificationUsers)
      .set({ read: true })
      .where(eq(notificationUsers.id, notificationUserId));
  }

  async createUserNotification(data: CreateNotificationUserInput) {
    const [notifUser] = await this.db
      .insert(notificationUsers)
      .values(data)
      .returning();
    return notifUser;
  }

  async updateUserNotification(notificationUserId: number, data: UpdateNotificationUserInput) {
    return await this.db
      .update(notificationUsers)
      .set(data)
      .where(eq(notificationUsers.id, notificationUserId));
  }

  // ================== TEMPLATES ==================

  async createTemplate(data: CreateNotificationTemplateInput) {
    const [template] = await this.db
      .insert(notificationTemplates)
      .values(data)
      .returning();
    return template;
  }

  async updateTemplate(templateId: number, data: UpdateNotificationTemplateInput) {
    return await this.db
      .update(notificationTemplates)
      .set(data)
      .where(eq(notificationTemplates.id, templateId));
  }

  async getTemplate(templateId: number): Promise<NotificationTemplate | undefined> {
    const [template] = await this.db
      .select()
      .from(notificationTemplates)
      .where(eq(notificationTemplates.id, templateId));
    return template;
  }
}
