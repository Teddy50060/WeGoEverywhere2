import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { schema } from '@backend/src/database/schema';
import { UpdateUserDto } from './users.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UserService {
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

  async update(id: number, updateuserdto: UpdateUserDto) {
    // First check if user exists
    const existingUser = await this.usersRepo.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    
    // Update the user
    const [updateuser] = await this.db
      .update(schema.users)
      .set(updateuserdto)
      .where(eq(schema.users.userId, id))
      .returning();
  
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
