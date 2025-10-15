// src/core/event/event.repository.ts
import type { DbType } from '@backend/src/database/connection';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, count } from 'drizzle-orm';
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
    // Get all events with participant count
    const events = await this.db.query.event.findMany();
    
    // Get participant counts for all events
    const eventsWithParticipants = await Promise.all(
      events.map(async (event) => {
        const participantCountResult = await this.db
          .select({ count: count() })
          .from(schema.joined)
          .where(eq(schema.joined.eventId, event.eventId));
          
        const participantCount = participantCountResult[0]?.count || 0;
        
        return {
          ...event,
          currentParticipants: participantCount
        };
      })
    );
    
    return eventsWithParticipants;
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
