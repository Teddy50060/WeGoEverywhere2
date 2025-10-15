import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DbType } from '@backend/src/database/connection';
import { schema } from '@backend/src/database/schema';
import { eq } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core/session';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';

type DbOrTx = NodePgDatabase<typeof schema> | PgTransaction<any, any, any>;

@Injectable()
export class ImagesRepository {
  constructor(@Inject('DatabaseConnection') private readonly db: DbType) {}

  async insertImage(
    tx: DbOrTx | null,
    {
      imageId,
      mime,
      bytes,
      width,
      height,
      sizeBytes,
    }: {
      imageId: string;
      mime: string;
      bytes: Buffer;
      width: number;
      height: number;
      sizeBytes: number;
    },
  ) {
    const conn = tx ?? this.db;
    await conn
      .insert(schema.images)
      .values({ imageId, mime, bytes, width, height, sizeBytes })
      .onConflictDoNothing();
    return { imageId, mime, width, height, sizeBytes };
  }

  async getImageById(imageId: string) {
    const [img] = await this.db
      .select()
      .from(schema.images)
      .where(eq(schema.images.imageId, imageId))
      .limit(1);
    if (!img) throw new NotFoundException('image not found');
    return img;
  }

  async linkToEvent(tx: DbOrTx | null, eventId: number, imageId: string) {
    const conn = tx ?? this.db;
    await conn
      .insert(schema.eventImages)
      .values({ eventId, imageId })
      .onConflictDoNothing();
    return { eventId, imageId };
  }
}
