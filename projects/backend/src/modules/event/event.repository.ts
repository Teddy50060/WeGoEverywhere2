// src/core/event/event.repository.ts
import type { DbType } from '@backend/src/database/connection';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { schema } from '@backend/src/database/schema';

@Injectable()
export class EventRepository {
  constructor(@Inject('DatabaseConnection') private readonly db: DbType) {}

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
    return found;
  }

  async findAll() {
    return this.db.query.event.findMany();
  }

  async create(dto: CreateEventDto) {
    const [created] = await this.db
      .insert(schema.event)
      .values(dto)
      .returning();
    if (!created)
      throw new NotFoundException('The event is not created successfully.');
    return created;
  }

  async update(id: number, dto: UpdateEventDto) {
    const [updated] = await this.db
      .update(schema.event)
      .set(dto)
      .where(eq(schema.event.eventId, id))
      .returning();
    if (!updated) throw new NotFoundException(`Event with ID ${id} not found.`);
    return updated;
  }
}
