import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.userId, { onDelete: "cascade" }),
  title: text('title').notNull(),
  fromService: text('from_service'),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type Notifications = InferSelectModel<typeof notifications>;