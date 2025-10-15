// src/core/event/event.repository.ts
import type { DbType } from '@backend/src/database/connection';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, count, inArray } from 'drizzle-orm';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { schema } from '@backend/src/database/schema';

@Injectable()
export class EventRepository {
  constructor(@Inject('DatabaseConnection') private readonly db: DbType) {}

  async findById(id: number) {
    const rows = await this.db
      .select({
        eventId: schema.event.eventId,
        cost: schema.event.cost,
        name: schema.event.name,
        date: schema.event.date,
        time: schema.event.time,
        place: schema.event.place,
        capacity: schema.event.capacity,
        detail: schema.event.detail,
        rating: schema.event.rating,
        status: schema.event.status,
        userId: schema.event.userId,
        currentParticipants: count(schema.joined.userId).as('currentParticipants')
      })
      .from(schema.event)
      .leftJoin(schema.joined, eq(schema.event.eventId, schema.joined.eventId))
      .where(eq(schema.event.eventId, id))
      .groupBy(schema.event.eventId)
      .limit(1);

    const found = rows[0];
    if (!found) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return found;
  }

  async findAll() {
    // Get events with participant counts, sorted by date (upcoming first)
    const eventsWithCounts = await this.db
      .select({
        eventId: schema.event.eventId,
        cost: schema.event.cost,
        name: schema.event.name,
        date: schema.event.date,
        time: schema.event.time,
        place: schema.event.place,
        capacity: schema.event.capacity,
        detail: schema.event.detail,
        rating: schema.event.rating,
        status: schema.event.status,
        userId: schema.event.userId,
        currentParticipants: count(schema.joined.userId).as('currentParticipants')
      })
      .from(schema.event)
      .leftJoin(schema.joined, eq(schema.event.eventId, schema.joined.eventId))
      .groupBy(schema.event.eventId)
      .orderBy(schema.event.date, schema.event.time);

    return eventsWithCounts;
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

  async findUserJoinedEvents(userId: number) {
    // First get the event IDs that the user joined
    const userJoinedEventIds = await this.db
      .select({ eventId: schema.joined.eventId })
      .from(schema.joined)
      .where(eq(schema.joined.userId, userId));

    if (userJoinedEventIds.length === 0) {
      return [];
    }

    const eventIds = userJoinedEventIds.map(j => j.eventId);

    // Then get full event details with participant counts for those events, sorted by date
    const joinedEvents = await this.db
      .select({
        eventId: schema.event.eventId,
        cost: schema.event.cost,
        name: schema.event.name,
        date: schema.event.date,
        time: schema.event.time,
        place: schema.event.place,
        capacity: schema.event.capacity,
        detail: schema.event.detail,
        rating: schema.event.rating,
        status: schema.event.status,
        userId: schema.event.userId,
        currentParticipants: count(schema.joined.userId).as('currentParticipants')
      })
      .from(schema.event)
      .leftJoin(schema.joined, eq(schema.event.eventId, schema.joined.eventId))
      .where(inArray(schema.event.eventId, eventIds))
      .groupBy(schema.event.eventId)
      .orderBy(schema.event.date, schema.event.time);

    return joinedEvents;
  }
}
