import { randomUUID } from "node:crypto";
import { registrationRepository } from '../Repositories/verification.repository.js';
const registrationServices = {
  async generateVerificationCode() {
    const fullUUID = randomUUID();
    const verificationCode = fullUUID.replace(/-/g, "").substring(0, 32);
    const expiresAt = new Date(Date.now() + parseInt(process.env.CONFIRMATION_CODE_EXPIRES_MINUTES || "15") * 60 * 1e3);
    return { verificationCode, expiresAt };
  },
  async updateVerificationCode(email, verificationCode, expiresAt) {
    return registrationRepository.updateVerificationCode(email, verificationCode, expiresAt);
  },
  async createSession(userData) {
    const { verificationCode, expiresAt } = await this.generateVerificationCode();
    return await registrationRepository.createSession(userData, verificationCode, expiresAt);
  },
  async getActiveSession(email) {
    return registrationRepository.getActiveSession(email);
  },
  async verifySession(verificationCode) {
    return registrationRepository.verifySession(verificationCode);
  },
  deleteSession(verificationCode) {
    return registrationRepository.deleteSession(verificationCode);
  }
};
export {
  registrationServices
};
