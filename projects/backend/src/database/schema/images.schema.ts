import {
  pgTable,
  char,
  text,
  integer,
  timestamp,
  primaryKey,
  customType,
} from 'drizzle-orm/pg-core';

export const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

export const images = pgTable('images', {
  imageId: char('image_id', { length: 64 }).primaryKey(),
  mime: text('mime').notNull(), 
  bytes: bytea('bytes').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const eventImages = pgTable(
  'event_images',
  {
    eventId: integer('event_id').notNull(),
    imageId: char('image_id', { length: 64 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.imageId] }),
  }),
);
