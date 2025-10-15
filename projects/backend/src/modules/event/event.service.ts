// backend/src/events/events.service.ts
// backend/src/events/events.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UpdateEventDto,
  CreateEventDto,
  CreateEventWithImageDto,
  UpdateEventWithImageDto,
} from './event.dto';
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

  async createEventWithImage(
    dto: CreateEventWithImageDto,
    file: Express.Multer.File,
  ) {
    return this.eventRepo.createWithImage(dto, file);
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepo.update(id, updateEventDto);
  }

  async updateEventWithImage(
    id: number,
    dto: UpdateEventWithImageDto,
    file?: Express.Multer.File,
  ) {
    return this.eventRepo.updateWithImage(id, dto, file);
  }
}
