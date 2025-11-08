import database from "../../../Database/database";
import { and, eq, gt } from "drizzle-orm";
import { registrationSessionsType } from "../Types/auth.types";
import { registrationSessions } from "../../../Database/schema";
import bcrypt from "bcrypt";
import {UsersRepository} from "../../Users/Repositories/users.repository";

export const registrationRepository = {
    async createSession(userData: { email: string; login: string; password: string }, verificationCode: string, expiresAt: Date): Promise<registrationSessionsType> {
        const { email, login, password } = userData;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const now = new Date();

        const [session] = await database.getDB()
            .insert(registrationSessions)
            .values({
                email,
                login,
                password: passwordHash,
                verificationCode,
                lastSentAt: now,
                expiresAt
            })

        try {
            await UsersRepository.create(userData);
        } catch (error: any) {
            throw error;
        }

        if (!session) {
            throw new Error("Failed to create registration session");
        }

        return session;
    },

    async getActiveSessionByEmail(email: string): Promise<registrationSessionsType | null> {
        const now = new Date();

        const [session] = await database.getDB()
            .select()
            .from(registrationSessions)
            .where(
                and(
                    eq(registrationSessions.email, email),
                    gt(registrationSessions.expiresAt, now)
                )
            )
            .limit(1);

        return session || null;
    },

    async getActiveSessionByCode(verificationCode: string): Promise<registrationSessionsType | null> {
        const now = new Date();

        const [session] = await database.getDB()
            .select()
            .from(registrationSessions)
            .where(
                and(
                    eq(registrationSessions.verificationCode, verificationCode),
                    gt(registrationSessions.expiresAt, now)
                )
            )
            .limit(1);

        return session || null;
    },

    async verifySession(verificationCode: string): Promise<boolean> {
        const session = await this.getActiveSessionByCode(verificationCode);

        if (!session) return false;

        await database.getDB()
            .update(registrationSessions)
            .set({ isVerified: true })
            .where(eq(registrationSessions.verificationCode, verificationCode));

        return true;
    },

    async resendVerificationCode(email: string, newCode: string): Promise<boolean> {
        const session = await this.getActiveSessionByEmail(email);

        if (!session) return false;

        const timeSinceLastSend = Date.now() - session.lastSentAt.getTime();
        if (timeSinceLastSend < 60 * 1000) return false;

        const now = new Date();

        await database.getDB()
            .update(registrationSessions)
            .set({
                verificationCode: newCode,
                lastSentAt: now,
                attempts: 0
            })
            .where(eq(registrationSessions.email, email));

        return true;
    },

    async deleteSession(verificationCode: string): Promise<void> {
        await database.getDB()
            .delete(registrationSessions)
            .where(eq(registrationSessions.verificationCode, verificationCode));
    }
};