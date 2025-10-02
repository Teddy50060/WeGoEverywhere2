import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { boolean, integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { notificationTemplates } from "./notification_templates.schema";

export const notificationUsers = pgTable('notification_users', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  notificationId: integer('notification_id')
    .notNull()
    .references(() => notificationTemplates.id),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type NotificationUser = InferSelectModel<typeof notificationUsers>;
export type NewNotificationUser = InferInsertModel<typeof notificationUsers>;

export type CreateNotificationUserInput = Omit<
  NewNotificationUser,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateNotificationUserInput = Partial<
  Omit<NewNotificationUser, 'id' | 'createdAt' | 'updatedAt'>
>;