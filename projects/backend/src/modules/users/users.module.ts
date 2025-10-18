// users.module.ts
import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserController } from './users.controller';
import { DatabaseModule } from '../../database/database.module';
import { UserService } from './users.service';
import { forwardRef } from '@nestjs/common';
import { EventsModule } from '../event/event.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => EventsModule)],
  providers: [UsersRepository,UserService],
  controllers: [UserController],
  exports: [UsersRepository, UserService],
})
export class UsersModule {}
