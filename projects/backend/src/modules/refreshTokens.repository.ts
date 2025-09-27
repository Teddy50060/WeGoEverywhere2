import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { refreshTokens } from '@backend/src/database/schema/refreshTokens.schema';
import { hash as argon2Hash, verify as argon2Verify } from '@node-rs/argon2'; // or argon2
import type { DbType } from '../database/connection';

@Injectable()
export class RefreshTokensRepository {
  constructor
  (
    @Inject('DatabaseConnection') private readonly db: DbType,
  ) 
  {

  }

  async create(userId: number, rawToken: string, expiresAt: Date, ip?: string, ua?: string) {
    const tokenHash = await argon2Hash(rawToken);
    // Generate a random id (for demo, use timestamp + random)
    const id = Date.now() + Math.floor(Math.random() * 10000);
    await this.db.insert(refreshTokens).values({
      id,
      userId,
      tokenHash,
      revoked: false,
      expiresAt,
      createdAt: new Date(),
      createdByIp: ip,
 
    });
  }

  async revokeById(id: number) {
    await this.db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.id, id));
  }

  async revokeAllByUser(userId: number) {
    await this.db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.userId, userId));
  }

  async findValidByUser(userId: number) {
    return this.db.select().from(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  // NEW: do the hash comparison here so controller doesn’t import argon2
  async findMatchingIdForUser(userId: number, rawToken: string): Promise<number | null> {
    const rows = await this.findValidByUser(userId);
    for (const row of rows) {
      if (row.revoked || row.expiresAt < new Date()) continue;
      if (row.tokenHash && await argon2Verify(row.tokenHash, rawToken)) return row.id;
    }
    return null;
  }
}
