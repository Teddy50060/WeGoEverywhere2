// users.module.ts
import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserController } from './users.controller';
import { DatabaseModule } from '../../database/database.module';
import { UserService } from './users.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [DatabaseModule
    ,UploadModule,
  ],
  providers: [UsersRepository,UserService],
  controllers: [UserController],
  exports: [UsersRepository],
})
export class UsersModule {}
