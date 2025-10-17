import { Inject, Injectable, NotFoundException } from '@nestjs/common'; // <-- Add NotFoundException
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import { schema } from '@backend/src/database/schema';
import { UpdateUserDto } from './users.dto'; // <-- Import the DTO
import { UsersRepository } from './users.repository';
import type { DbType } from '@backend/src/database/connection';

@Injectable()
export class UserService{
  constructor(
    @Inject('DatabaseConnection') private readonly db: DbType,
    private readonly usersRepo: UsersRepository) {}

  async getAllUsers() {
    return this.usersRepo.findAll();
  }

  async getUser(
    id : number ,
  ) {
    return await this.usersRepo.findById(id);
  }


  async update(id : number , updateuserdto : UpdateUserDto){
    const [updateuser] = await this.db
    .update(schema.users)
    .set(updateuserdto)
    .where(eq(schema.users.userId, id))
    .returning();
    if(!updateuser){
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return updateuser;
  }

  async getPublicProfileById(userId: number) {
    const u = await this.usersRepo.findById(userId);
    if (!u) throw new NotFoundException('User not found');

    return {
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      telephoneNumber: u.telephoneNumber,
      bio: u.bio,
      birthdate: u.birthdate,
      sex: u.sex,
      signupTime: u.signupTime,
      signupDate: u.signupDate,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }
}
