import { randomUUID } from "node:crypto";
import { registrationRepository } from '../Repositories/verification.repository.js';
const registrationServices = {
  async createSession(userData) {
    if (!userData.email || !userData.login || !userData.password) {
      throw new Error("Missing required fields: email, login, password");
    }
    const fullUUID = randomUUID();
    const verificationCode = fullUUID.replace(/-/g, "").substring(0, 32);
    const expiresAt = new Date(Date.now() + parseInt(process.env.CONFIRMATION_CODE_EXPIRES_MINUTES || "15") * 60 * 1e3);
    const newSession = await registrationRepository.createSession(userData, verificationCode, expiresAt);
    return { newSession, verificationCode };
  },
  getActiveSessionByEmail(email) {
    return registrationRepository.getActiveSessionByEmail(email);
  },
  async verifySession(verificationCode) {
    return registrationRepository.verifySession(verificationCode);
  },
  async resendVerificationCode(email) {
    const session = await registrationRepository.getActiveSessionByEmail(email);
    if (!session) {
      return { success: false, message: "\u0421\u0435\u0441\u0441\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" };
    }
    const timeSinceLastSend = Date.now() - session.lastSentAt.getTime();
    if (timeSinceLastSend < 60 * 1e3) {
      const waitTime = Math.ceil((60 * 1e3 - timeSinceLastSend) / 1e3);
      return {
        success: false,
        message: `\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 ${waitTime} \u0441\u0435\u043A\u0443\u043D\u0434 \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0439 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u043E\u0439`,
        nextResend: waitTime
      };
    }
    const fullUUID = randomUUID();
    const newCode = fullUUID.replace(/-/g, "").substring(0, 32);
    const updated = await registrationRepository.resendVerificationCode(email, newCode);
    if (!updated) {
      return { success: false, message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043A\u043E\u0434" };
    }
    return { success: true, newCode, message: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D" };
  },
  deleteSession(verificationCode) {
    return registrationRepository.deleteSession(verificationCode);
  }
};
export {
  registrationServices
};
