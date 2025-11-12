import database from '../../../Database/database.js';
import { userTokens } from '../../../Database/schema.js';
import { eq } from "drizzle-orm";
const TokensRepository = {
  async createRefreshTokenRecord(userId, refreshToken, expires) {
    const db = await database.getDB();
    await db.insert(userTokens).values({ userId, token: refreshToken, expiresAt: expires });
    return;
  },
  async getRefreshTokenRecord(refreshToken) {
    const db = await database.getDB();
    const [tokenRecord] = await db.select(userTokens).findOne(refreshToken).limit(1);
    return tokenRecord || null;
  },
  async deleteRefreshTokenRecord(refreshToken) {
    const db = await database.getDB();
    await db.delete(userTokens).where(eq(userTokens.token, refreshToken));
    return;
  },
  async deleteManyTokenRecords(userId) {
    const db = await database.getDB();
    await db.delete(userTokens).where(eq(userTokens.userId, userId));
  }
};
export {
  TokensRepository
};
