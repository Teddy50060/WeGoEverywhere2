import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './users.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepo: UsersRepository
  ) {}

  async getAllUsers() {
    return this.usersRepo.findAll();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersRepo.updateById(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return updatedUser;
  }

  async getPublicProfileById(userId: number) {
    const u = await this.usersRepo.findById(userId);
    if (!u) throw new NotFoundException('User not found');

    return {
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      telephoneNumber: u.telephoneNumber,
      bio: u.bio,
      birthdate: u.birthdate,
      sex: u.sex,
      signupTime: u.signupTime,
      signupDate: u.signupDate,
      cookiePolicyVersionAccepted: u.cookiePolicyVersionAccepted,
      cookiePolicyAcceptedAt: u.cookiePolicyAcceptedAt,
    };
  }
}
