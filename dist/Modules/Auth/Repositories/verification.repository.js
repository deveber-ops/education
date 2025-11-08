import database from '../../../Database/database.js';
import { and, eq, gt } from "drizzle-orm";
import { registrationSessions } from '../../../Database/schema.js';
import bcrypt from "bcrypt";
import { UsersRepository } from '../../Users/Repositories/users.repository.js';
const registrationRepository = {
  async createSession(userData, verificationCode, expiresAt) {
    const { email, login, password } = userData;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const now = /* @__PURE__ */ new Date();
    const [session] = await database.getDB().insert(registrationSessions).values({
      email,
      login,
      password: passwordHash,
      verificationCode,
      lastSentAt: now,
      expiresAt
    });
    try {
      await UsersRepository.create(userData);
    } catch (error) {
      throw error;
    }
    if (!session) {
      throw new Error("Failed to create registration session");
    }
    return session;
  },
  async getActiveSessionByEmail(email) {
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
    if (!session) return false;
    await database.getDB().update(registrationSessions).set({ isVerified: true }).where(eq(registrationSessions.verificationCode, verificationCode));
    return true;
  },
  async resendVerificationCode(email, newCode) {
    const session = await this.getActiveSessionByEmail(email);
    if (!session) return false;
    const timeSinceLastSend = Date.now() - session.lastSentAt.getTime();
    if (timeSinceLastSend < 60 * 1e3) return false;
    const now = /* @__PURE__ */ new Date();
    await database.getDB().update(registrationSessions).set({
      verificationCode: newCode,
      lastSentAt: now,
      attempts: 0
    }).where(eq(registrationSessions.email, email));
    return true;
  },
  async deleteSession(verificationCode) {
    await database.getDB().delete(registrationSessions).where(eq(registrationSessions.verificationCode, verificationCode));
  }
};
export {
  registrationRepository
};
