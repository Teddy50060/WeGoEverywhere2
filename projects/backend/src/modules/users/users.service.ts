import { Inject, Injectable, NotFoundException } from '@nestjs/common'; // <-- Add NotFoundException
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';     
import { schema } from '@backend/src/database/schema';
import { UpdateUserDto } from './users.dto'; // <-- Import the DTO
import { UsersRepository } from './users.repository';

@Injectable()
export class UserService{
  constructor(
    private readonly usersRepo: UsersRepository,
    @Inject('DatabaseConnection') private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async getAllUsers() {
    return this.usersRepo.findAll();
  }

  async getUserById(id: number) {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async update(id : number , updateuserdto : UpdateUserDto){
    // First check if user exists
    const existingUser = await this.usersRepo.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    
    // Update the user (you might want to add an update method to the repository)
    const[updateuser] = await this.db
    .update(schema.users)
    .set(updateuserdto)
    .where(eq(schema.users.userId, id))
    .returning();
  
  return updateuser;
  }
}