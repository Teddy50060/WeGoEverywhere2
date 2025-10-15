// src/core/event/event.repository.ts
import type { DbType } from '@backend/src/database/connection';
import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  CreateEventDto,
  CreateEventWithImageDto,
  UpdateEventDto,
  UpdateEventWithImageDto,
} from './event.dto';
import { schema } from '@backend/src/database/schema';
import { ImagesRepository } from '../images/images.repository';
import { ImagesService } from '../images/images.service';

@Injectable()
export class EventRepository {
  constructor(
    @Inject('DatabaseConnection') private readonly db: DbType,
    private readonly imagesService: ImagesService,
    private readonly imagesRepo: ImagesRepository,
  ) {}

  async findById(id: number) {
    const rows = await this.db
      .select()
      .from(schema.event)
      .where(eq(schema.event.eventId, id))
      .limit(1);

    const found = rows[0];
    if (!found) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    const imageRow = await this.db
      .select({ imageId: schema.eventImages.imageId })
      .from(schema.eventImages)
      .where(eq(schema.eventImages.eventId, id))
      .limit(1);

    const imageId = imageRow[0]?.imageId ?? null;

    return { ...found, imageId };
  }

  async findAll() {
    return this.db.query.event.findMany();
  }

  async create(createEventDto: CreateEventDto) {
    const [newEvent] = await this.db
      .insert(schema.event)
      .values(createEventDto)
      .returning();

    if (!newEvent) {
      throw new NotFoundException(`The event is not created successfully.`);
    }
    return newEvent;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const [updatedEvent] = await this.db
      .update(schema.event)
      .set(updateEventDto)
      .where(eq(schema.event.eventId, id))
      .returning();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }
    return updatedEvent;
  }

  async updateWithImage(
    id: number,
    dto: UpdateEventWithImageDto,
    file?: Express.Multer.File,
  ) {
    let preparedImage: {
      imageId: string;
      mime: string;
      bytes: Buffer;
      width: number;
      height: number;
      sizeBytes: number;
    } | null = null;
    if (file) {
      const imageResult = await this.imagesService.toWebp(file);
      preparedImage = {
        imageId: imageResult.imageId,
        mime: imageResult.mime,
        bytes: imageResult.bytes,
        width: imageResult.width,
        height: imageResult.height,
        sizeBytes: imageResult.sizeBytes,
      };
    }

    return this.db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(schema.event)
        .where(eq(schema.event.eventId, id))
        .limit(1);
      if (!existing) throw new NotFoundException(`Event ${id} not found`);

      const { file: _omit, ...eventData } = dto as any;
      const [updated] = await tx
        .update(schema.event)
        .set(eventData)
        .where(eq(schema.event.eventId, id))
        .returning();

      if (!updated) throw new BadRequestException('Failed to update event');

      if (preparedImage) {
        await this.imagesRepo.insertImage(tx, preparedImage);
        await this.imagesRepo.linkToEvent(tx, id, preparedImage.imageId);
        return { ...updated, imageId: preparedImage.imageId };
      }

      return updated;
    });
  }

  async createWithImage(
    dto: CreateEventWithImageDto,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('file is required');

    return await this.db.transaction(async (tx) => {
      const image = await this.imagesService.toWebp(file);

      await this.imagesRepo.insertImage(tx, image);

      const eventData = { ...dto };
      delete (eventData as any).file;
      const [created] = await tx
        .insert(schema.event)
        .values(eventData as Required<Omit<typeof eventData, 'file'>>)
        .returning();

      await this.imagesRepo.linkToEvent(tx, created.eventId, image.imageId);

      return { ...created, imageId: image.imageId };
    });
  }
}
