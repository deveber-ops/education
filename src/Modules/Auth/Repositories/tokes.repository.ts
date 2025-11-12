import database from "../../../Database/database";
import {userTokens} from "../../../Database/schema";
import {TokenType} from "../Types/token.types";
import {eq} from "drizzle-orm";

export const TokensRepository = {
    async createRefreshTokenRecord(userId: number, refreshToken: string, expires: Date): Promise<void> {
        const db = await database.getDB();

        await db
            .delete(userTokens)
            .where(eq(userTokens.userId, userId))

        await db
            .insert(userTokens)
            .values({userId, token: refreshToken , expiresAt: expires})

        return
    },

    async getRefreshTokenRecord(refreshToken: string): Promise<TokenType> {
        const db = await database.getDB();

        const [tokenRecord] = await db
            .select(userTokens)
            .findOne(refreshToken)
            .limit(1);

        return tokenRecord || null;
    },

    async deleteRefreshTokenRecord(refreshToken: string): Promise<void> {
        const db = await database.getDB();

        await db
            .delete(userTokens)
            .where(eq(userTokens.token, refreshToken));

        return
    },

    async deleteManyTokenRecords(userId: number): Promise<void> {
        const db = await database.getDB();

        await db
            .delete(userTokens)
            .where(eq(userTokens.userId, userId));
    }
}