// backend/src/events/events.service.ts
// backend/src/events/events.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { schema } from '@backend/src/database/schema';
import { UpdateEventDto, CreateEventDto } from './event.dto';
import { EventRepository } from './event.repository';
import { join } from 'path/win32';

import { promises as fs } from 'fs';
function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\-]+/g, '_');
}

@Injectable()
export class EventService {
  constructor(private readonly eventRepo: EventRepository) {}

  private assertCategories(categories: unknown) {
    if (!Array.isArray(categories) || categories.length < 1) {
      throw new BadRequestException('categories must have at least 1 item');
    }
    for (const c of categories) {
      if (typeof c !== 'string') {
        throw new BadRequestException('categories must be string[]');
      }
    }
  }

  async getAllEvents() {
    return this.eventRepo.findAll();
  }

  async createEvent(createEventDto: CreateEventDto) {
    return this.eventRepo.create(createEventDto);
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepo.update(id, updateEventDto);
  }

  async getEventById(id: number) {
    return this.eventRepo.findById(id);
  }

  async createEventWithImage(dto: CreateEventDto, file?: Express.Multer.File) {
    this.assertCategories(dto.categories);

    if (!file?.buffer || !file.originalname) {
      throw new BadRequestException('file (image) is required');
    }
    if (/^\d{2}:\d{2}$/.test(dto.time)) dto.time = `${dto.time}:00`;

    const uploadRoot = join(process.cwd(), 'uploads', 'events');
    const filename = `${Date.now()}-${sanitizeFilename(file.originalname)}`;
    const fsPath = join(uploadRoot, filename);
    const publicPath = `/uploads/events/${filename}`;

    await fs.mkdir(uploadRoot, { recursive: true });

    try {
      await fs.writeFile(fsPath, file.buffer);
    } catch {
      throw new BadRequestException('Failed to save image file');
    }

    try {
      const created = await this.eventRepo.create({
        ...dto,
        imagePath: publicPath,
      });
      return created;
    } catch (e) {
      await fs.rm(fsPath, { force: true });
      throw e;
    }
  }

  async updateEventWithImage(
    id: number,
    dto: UpdateEventDto,
    file?: Express.Multer.File,
  ) {
    const existing = await this.eventRepo.findById(id);
    if (!existing) throw new NotFoundException(`Event ${id} not found`);

    if (dto.time && /^\d{2}:\d{2}$/.test(dto.time)) {
      dto.time = `${dto.time}:00`;
    }

    let newPublicPath: string | undefined;
    let newFsPath: string | undefined;
    let oldFsPathToDelete: string | undefined;

    if (file) {
      if (!file.buffer?.length || !file.originalname) {
        throw new BadRequestException('Invalid image file');
      }

      const uploadRoot = join(process.cwd(), 'uploads', 'events');
      await fs.mkdir(uploadRoot, { recursive: true });

      const filename = `${Date.now()}-${sanitizeFilename(file.originalname)}`;
      newFsPath = join(uploadRoot, filename);
      newPublicPath = `/uploads/events/${filename}`;

      try {
        await fs.writeFile(newFsPath, file.buffer);
      } catch {
        throw new BadRequestException('Failed to save image file');
      }

      if (existing.imagePath) {
        const rel = existing.imagePath.replace(/^\//, '');
        oldFsPathToDelete = join(process.cwd(), rel);
      }
    }

    try {
      const updated = await this.eventRepo.update(id, {
        ...dto,
        ...(newPublicPath ? { imagePath: newPublicPath } : {}),
      });

      if (oldFsPathToDelete) {
        try {
          await fs.rm(oldFsPathToDelete, { force: true });
        } catch {}
      }

      return updated;
    } catch (e) {
      if (newFsPath) {
        try {
          await fs.rm(newFsPath, { force: true });
        } catch {}
      }
      throw e;
    }
  }
}
