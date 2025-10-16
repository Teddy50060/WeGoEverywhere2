import { Injectable } from '@nestjs/common';
import { oauthIdentities } from '@backend/src/database/schema/oauthIdentities.schema';
import { eq, and } from 'drizzle-orm';
import { db } from '@backend/src/database/connection';

@Injectable()
export class OAuthUsersRepository {
  async createOAuthUser(
    userId: number,
    provider: string,
    subject: string,
    email?: string,
  ) {
    const [row] = await db
      .insert(oauthIdentities)
      .values({
        userId,
        provider,
        subject,
        email
      })
      .returning({
        id: oauthIdentities.id,
        userId: oauthIdentities.userId,
        provider: oauthIdentities.provider,
        subject: oauthIdentities.subject,
        email: oauthIdentities.email,
        emailVerified: oauthIdentities.emailVerified,
        createdAt: oauthIdentities.createdAt,
      });
    return row;
  }

  async findByUserId(userId: number) {
    const [user] = await db
      .select({
        id: oauthIdentities.id,
        userId: oauthIdentities.userId,
        provider: oauthIdentities.provider,
        subject: oauthIdentities.subject,
        email: oauthIdentities.email,
        emailVerified: oauthIdentities.emailVerified,
        createdAt: oauthIdentities.createdAt,
      })
      .from(oauthIdentities)
      .where(eq(oauthIdentities.userId, userId))
      .limit(1);
    return user;
  }

  async findByGithubId(githubId: string) {
    const [user] = await db
      .select({
        id: oauthIdentities.id,
        userId: oauthIdentities.userId,
        provider: oauthIdentities.provider,
        subject: oauthIdentities.subject,
        email: oauthIdentities.email,
        emailVerified: oauthIdentities.emailVerified,
        createdAt: oauthIdentities.createdAt,
      })
      .from(oauthIdentities)
      .where(eq(oauthIdentities.subject, githubId))
      .limit(1);
    return user;
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select({
        id: oauthIdentities.id,
        userId: oauthIdentities.userId,
        provider: oauthIdentities.provider,
        subject: oauthIdentities.subject,
        email: oauthIdentities.email,
        emailVerified: oauthIdentities.emailVerified,
        createdAt: oauthIdentities.createdAt,
      })
      .from(oauthIdentities)
      .where(eq(oauthIdentities.email, email))
      .limit(1);
    return user;
  }
}