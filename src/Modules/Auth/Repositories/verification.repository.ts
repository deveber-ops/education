import database from "../../../Database/database";
import {and, eq, gt} from "drizzle-orm";
import { registrationSessionsType } from "../Types/auth.types";
import {registrationSessions} from "../../../Database/schema";
import {verificationError} from "../../../Core/Errors/verification.errors";
import {UsersService} from "../../Users/Services/users.service";
import bcrypt from "bcrypt";

export const registrationRepository = {
    async createSession(
        userData: { email: string; login: string; password: string },
        verificationCode: string,
        expiresAt: Date
    ): Promise<registrationSessionsType> {
        try {
            const db = database.getDB()
            const now = new Date();
            const { email, login, password } = userData;

            const [existingUserForEmail, existingUserForLogin] = await Promise.all([
                UsersService.findUser(email),
                UsersService.findUser(login)
            ]);

            if (existingUserForEmail) {
                throw new verificationError("Пользователь с таким email уже существует", "login");
            }
            if (existingUserForLogin) {
                throw new verificationError("Пользователь с таким login уже существует", "login");
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            await db
                .insert(registrationSessions)
                .values({
                    email: email,
                    login: login,
                    password: passwordHash,
                    verificationCode: verificationCode,
                    lastSentAt: now,
                    expiresAt: expiresAt
                });

            const [session] = await db
                .select()
                .from(registrationSessions)
                .where(eq(registrationSessions.email, email))
                .limit(1)

            if (!session) {
                throw new Error("Failed to create registration session");
            }

            return session;
        } catch (error: any) {
            if (error.cause?.code === 'ER_DUP_ENTRY' && error.cause?.sqlMessage.includes('login')) {
                throw new verificationError("Пользователь с таким email уже существует", "login");
            }
            if (error.cause?.code === 'ER_DUP_ENTRY' && error.cause?.sqlMessage.includes('email')) {
                throw new verificationError("Пользователь с таким email уже существует", "email");
            }
            console.log(error)
            throw error;
        }
    },

    async updateVerificationCode(email: string, verificationCode: string, expiresAt: Date): Promise<void> {
        await database.getDB()
            .update(registrationSessions)
            .set({verificationCode, expiresAt})
            .where(eq(registrationSessions.email, email));
    },

    async getActiveSession(email: string): Promise<registrationSessionsType | null> {
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

        if (!session) throw new verificationError("Код подтверждения просрочен или недействителен.", 'code');

        const {login, email, password} = session;

        await database.getDB()
            .update(registrationSessions)
            .set({ isVerified: true })
            .where(eq(registrationSessions.verificationCode, verificationCode));

        await UsersService.create({login, email, password}, true)

        return true;
    },

    async deleteSession(verificationCode: string): Promise<void> {
        await database.getDB()
            .delete(registrationSessions)
            .where(eq(registrationSessions.verificationCode, verificationCode));
    }
};