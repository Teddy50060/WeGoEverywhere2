import { Inject, Injectable, NotFoundException } from '@nestjs/common'; // <-- Add NotFoundException
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';     
import { schema } from '@backend/src/database/schema';
import { UpdateUserDto } from './users.dto'; // <-- Import the DTO
import { UsersRepository } from './users.repository';
import { EventService } from '../event/event.service';

@Injectable()
export class UserService{
    private readonly db: NodePgDatabase<typeof schema>;

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly eventService: EventService
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
  async deleteUser(userId: number) {
      await this.eventService.markUserFutureEventsAsDeleted(userId); 
      const deletedUser = await this.usersRepo.deleteById(userId); 
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }
      return deletedUser;
    }

}