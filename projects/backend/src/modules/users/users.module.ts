// users.module.ts
import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserController } from './users.controller';
import { DatabaseModule } from '../../database/database.module';
import { UserService } from './users.service';
import { EventsModule } from '../event/event.module';

@Module({
  imports: [DatabaseModule,EventsModule],
  providers: [UsersRepository,UserService],
  controllers: [UserController],
  exports: [UsersRepository],
})
export class UsersModule {}