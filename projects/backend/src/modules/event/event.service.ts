import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEventDto, CreateEventDto } from './event.dto';
import { EventRepository } from './event.repository';
import { Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../users/users.service';

@Injectable()
export class EventService {

  async unjoinEvent(eventId: number, userId: number) {
    return this.eventRepo.unjoinEvent(eventId, userId);
  }

  async joinEvent(eventId: number, userId: number) {
    return this.eventRepo.joinEvent(eventId, userId);
  }
  constructor(
    private readonly eventRepo: EventRepository,
  @Inject(forwardRef(() => UserService))
  private readonly userService: UserService,
  ) {}

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
  async markUserFutureEventsAsDeleted(userId: number) {
    const now = new Date();
    return this.eventRepo.bulkUpdateStatusByUserId(
      userId,
      'deleted',
      now,
      ['active']
    );
  }

  async markUserFutureEventsAsDeleted(userId: number) {
    const now = new Date();
    return this.eventRepo.bulkUpdateStatusByUserId(
      userId,
      'deleted',
      now,
      ['active'],
    );
  }

  async getUserJoinedEvents(userId: number) {
    return this.eventRepo.findUserJoinedEvents(userId);
  }

  async getEventOrganizer(eventId: number) {
    const event = await this.eventRepo.findById(eventId);
    if (!event.userId) throw new NotFoundException('Event has no organizer');
    return this.userService.getPublicProfileById(event.userId);
  }
}
