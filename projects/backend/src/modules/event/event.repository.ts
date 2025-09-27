// src/core/event/event.repository.ts
import type { DbType } from '@backend/src/database/connection';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { schema } from '@backend/src/database/schema';

@Injectable()
export class EventRepository {
  constructor
  (
    @Inject('DatabaseConnection') private readonly db: DbType,
  ) 
  {

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
}
