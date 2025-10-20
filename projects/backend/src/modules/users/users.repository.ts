// users.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { users } from '@backend/src/database/schema/users.schema';
import { RegisterDto } from '@backend/src/modules/dto/register.dto';
import { eq } from 'drizzle-orm';
import type { DbType } from '@backend/src/database/connection';
import { authUsers } from '@backend/src/database/schema/authUsers.schema';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DatabaseConnection') private readonly db: DbType) {}
  async findAll() {
    return this.db.query.users.findMany();
  }

  async findById(userId: number) {
    // เลือกเฉพาะคอลัมน์ที่ต้องการ หรือ * ก็ได้
    const [row] = await this.db
      .select({
        userId: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        telephoneNumber: users.telephoneNumber,
        bio: users.bio,
        birthdate: users.birthdate,
        sex: users.sex,
        signupTime: users.signupTime,
        signupDate: users.signupDate,
        cookiePolicyVersionAccepted: users.cookiePolicyVersionAccepted,
        cookiePolicyAcceptedAt: users.cookiePolicyAcceptedAt,
        email: authUsers.email,
        createdAt: authUsers.createdAt,
        updatedAt: authUsers.updatedAt,
      })
      .from(users)
      .leftJoin(authUsers, eq(authUsers.userId, users.userId))
      .where(eq(users.userId, userId))
      .limit(1);

    // ถ้าไม่พบจะ return undefined
    return row ?? null;
  }

  async createUser(input: RegisterDto) {
    const [row] = await this.db
      .insert(users)
      .values({
        firstName: input.firstName,
        lastName: input.lastName,
        telephoneNumber: input.telephoneNumber ?? null,
        bio: input.bio ?? null,
        birthdate: input.birthdate,
        sex: input.sex ?? null,
      })
      .returning({
        userId: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        telephoneNumber: users.telephoneNumber,
        bio: users.bio,
        birthdate: users.birthdate,
        sex: users.sex,
        signupTime: users.signupTime,
        signupDate: users.signupDate,
        cookiePolicyVersionAccepted: users.cookiePolicyVersionAccepted,
        cookiePolicyAcceptedAt: users.cookiePolicyAcceptedAt,
      });
    return row;
  }

  async deleteById(userId: number) {
    const [deletedUser] = await this.db
      .delete(users)
      .where(eq(users.userId, userId))
      .returning();
    return deletedUser ?? null;
  }
}
