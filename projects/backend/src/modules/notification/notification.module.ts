import { Module } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '@backend/src/core/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
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
