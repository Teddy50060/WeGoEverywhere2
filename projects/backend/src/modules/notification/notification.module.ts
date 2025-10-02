import { Module } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [],
  providers: [
    NotificationRepository,
    NotificationService,
    NotificationGateway,
  ],
  controllers: [],
  exports: [
    NotificationService,
  ],
})
export class NotificationModule {}
