// backend/src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { DatabaseModule } from '../../database/database.module';
import { EventRepository } from './event.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventsModule {}