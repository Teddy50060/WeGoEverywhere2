import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import { schema } from '@backend/src/database/schema';
import { UpdateUserDto } from './users.dto';
import { UsersRepository } from './users.repository';
import { EventService } from '../event/event.service';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepo: UsersRepository,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService
  ) {}

  async findById(id: string | number) {
    // Accept string or number for controller compatibility
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(userId)) return null;
    return this.usersRepo.findById(userId);
  }
  private readonly db: NodePgDatabase<typeof schema>;

  async getAllUsers() {
    return this.usersRepo.findAll();
  }

  async update(id: number, updateuserdto: UpdateUserDto) {
    const [updateuser] = await this.db
      .update(schema.users)
      .set(updateuserdto)
      .where(eq(schema.users.userId, id))
      .returning();
    if (!updateuser) {
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

  async deleteUser(userId: number) {
    await this.eventService.markUserFutureEventsAsDeleted(userId); 
    const deletedUser = await this.usersRepo.deleteById(userId); 
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return deletedUser;
  }
}
