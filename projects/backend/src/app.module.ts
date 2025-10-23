import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './configurations/config';
import { AuthModule } from '@core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './core/auth/jwt/access-jwt/jwt.guard';
import { EventsModule } from './modules/event/event.module'; // <-- 1. Import EventsModule
import { ConsentModule } from './modules/consent/consent.module';
import { UploadModule } from './modules/upload/upload.module'
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    EventsModule,
    ConsentModule,
    UploadModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}