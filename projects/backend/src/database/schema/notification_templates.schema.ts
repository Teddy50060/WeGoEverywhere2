import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const notificationTemplates = pgTable('notification_templates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  fromService: text('from_service'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type NotificationTemplate = InferSelectModel<typeof notificationTemplates>;
export type NewNotificationTemplate = InferInsertModel<typeof notificationTemplates>;

export type CreateNotificationTemplateInput = Omit<
  NewNotificationTemplate,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateNotificationTemplateInput = Partial<
  Omit<NewNotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>
>;