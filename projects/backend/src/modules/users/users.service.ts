import { Inject, Injectable, NotFoundException } from '@nestjs/common'; // <-- Add NotFoundException
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';     
import { schema } from '@backend/src/database/schema';
import { UpdateUserDto } from './users.dto'; // <-- Import the DTO
import { UsersRepository } from './users.repository';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService{
    private readonly db: NodePgDatabase<typeof schema>;

  constructor(private readonly usersRepo: UsersRepository,
    private readonly uploadService: UploadService,
  ) {}

  async getAllUsers() {
    return this.usersRepo.findAll();
  }

  async update(id : number , updateuserdto : UpdateUserDto){
    const[updateuser] = await this.db
    .update(schema.users)
    .set(updateuserdto)
    .where(eq(schema.users.userId, id))
    .returning();
  if(!updateuser){
    throw new NotFoundException(`User with ID ${id} not found.`);
  }
  return updateuser;
  }
}