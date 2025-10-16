// src/notifications/notification.repo.ts
import { Inject, Injectable } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import type { DbType } from '@backend/src/database/connection';
import { notifications, Notifications } from '@backend/src/database/schema/notifications.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @Inject('DatabaseConnection') private readonly db: DbType,
  ) {}

  async getNotifs(userId: number, limit: number, offset: number = 0): Promise<(Notifications)[]>  {
    const results = await this.db
      .select()
      .from(notifications)
      .where(
        eq(notifications.userId, userId),
      )
      .orderBy(sql`read ASC, created_at DESC`)
      .limit(limit)
      .offset(offset);

    // map ให้ null → empty string
    return results.map(r => ({
      ...r,
      title: r.title ?? '',
      message: r.message ?? '',
      fromService: r.fromService ?? '',
    }));
  }

  async getNotifCount(userId: number, unreadOnly = true): Promise<number> {
    const condition = unreadOnly
      ? and(eq(notifications.userId, userId), eq(notifications.read, false))
      : eq(notifications.userId, userId);
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(condition);
    return result[0]?.count ?? 0;
  }


  async markAsRead(notificationId: number) {
    return await this.db
      .update(notifications)
      .set({ read: true, updatedAt: sql`NOW()`})
      .where(eq(notifications.id, notificationId));
  }

  async createNotification(
    userId: number,
    templateData: { title: string; fromService?: string; message: string },
  ): Promise<Notifications> {
    const [notif] = await this.db
      .insert(notifications)
      .values({
        userId: userId,
        title: templateData.title,
        fromService: templateData.fromService,
        message: templateData.message,
        read: false,
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .returning();

    return notif;
  }
}
