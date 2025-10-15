// backend/src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { DatabaseModule } from '../../database/database.module';
import { EventRepository } from './event.repository';
import { ImagesService } from '../images/images.service';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [DatabaseModule, ImagesModule],
  controllers: [EventController],
  providers: [EventService, EventRepository, ImagesService],
})
export class EventsModule {}
