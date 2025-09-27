// database.module.ts
import { Module, Global } from '@nestjs/common';
import { db } from './connection';

@Global()
@Module({
  providers: [
    {
      provide: 'DatabaseConnection',     // token สำหรับ DI
      useValue: db,
    },
  ],
  exports: ['DatabaseConnection'],
})
export class DatabaseModule {}
