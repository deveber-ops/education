import database from '../../../Database/database.js';
import { and, eq, gt } from "drizzle-orm";
import { registrationSessions } from '../../../Database/schema.js';
import { verificationError } from '../../../Core/Errors/verification.errors.js';
import { UsersService } from '../../Users/Services/users.service.js';
import bcrypt from "bcrypt";
const registrationRepository = {
  async createSession(userData, verificationCode, expiresAt) {
    try {
      const db = database.getDB();
      const now = /* @__PURE__ */ new Date();
      const { email, login, password } = userData;
      const existingUser = await UsersService.findUser(email);
      if (existingUser) {
        throw new verificationError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442", "email");
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await db.insert(registrationSessions).values({
        email,
        login,
        password: passwordHash,
        verificationCode,
        lastSentAt: now,
        expiresAt
      });
      const [session] = await db.select().from(registrationSessions).where(eq(registrationSessions.email, email)).limit(1);
      if (!session) {
        throw new Error("Failed to create registration session");
      }
      return session;
    } catch (error) {
      if (error.cause?.code === "ER_DUP_ENTRY") {
        throw new verificationError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442", "email");
      }
      console.log(error);
      throw error;
    }
  },
  async updateVerificationCode(email, verificationCode, expiresAt) {
    await database.getDB().update(registrationSessions).set({ verificationCode, expiresAt }).where(eq(registrationSessions.email, email));
  },
  async getActiveSession(email) {
    const now = /* @__PURE__ */ new Date();
    const [session] = await database.getDB().select().from(registrationSessions).where(
      and(
        eq(registrationSessions.email, email),
        gt(registrationSessions.expiresAt, now)
      )
    ).limit(1);
    return session || null;
  },
  async getActiveSessionByCode(verificationCode) {
    const now = /* @__PURE__ */ new Date();
    const [session] = await database.getDB().select().from(registrationSessions).where(
      and(
        eq(registrationSessions.verificationCode, verificationCode),
        gt(registrationSessions.expiresAt, now)
      )
    ).limit(1);
    return session || null;
  },
  async verifySession(verificationCode) {
    const session = await this.getActiveSessionByCode(verificationCode);
    if (!session) throw new verificationError("\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D \u0438\u043B\u0438 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u0435\u043D.", "code");
    const { login, email, password } = session;
    await database.getDB().update(registrationSessions).set({ isVerified: true }).where(eq(registrationSessions.verificationCode, verificationCode));
    await UsersService.create({ login, email, password }, true);
    return true;
  },
  async deleteSession(verificationCode) {
    await database.getDB().delete(registrationSessions).where(eq(registrationSessions.verificationCode, verificationCode));
  }
};
export {
  registrationRepository
};
