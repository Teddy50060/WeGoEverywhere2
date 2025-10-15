// backend/src/events/events.service.ts
// backend/src/events/events.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { schema } from '@backend/src/database/schema';
import { UpdateEventDto, CreateEventDto } from './event.dto';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepo: EventRepository) {}

  async getEventById(id: number) {
    return this.eventRepo.findById(id);
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
}
