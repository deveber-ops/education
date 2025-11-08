import { randomUUID } from "node:crypto";
import { registrationRepository } from "../Repositories/verification.repository";
import {registrationSessionsType} from "../Types/auth.types";

export const registrationServices = {
    async generateVerificationCode(): Promise<{verificationCode: string, expiresAt: Date}> {
        const fullUUID = randomUUID();
        const verificationCode = fullUUID.replace(/-/g, "").substring(0, 32);
        const expiresAt = new Date(Date.now() + parseInt(process.env.CONFIRMATION_CODE_EXPIRES_MINUTES || "15") * 60 * 1000);

        return {verificationCode, expiresAt};
    },

    async updateVerificationCode(email: string, verificationCode: string, expiresAt: Date): Promise<void> {
        return registrationRepository.updateVerificationCode(email, verificationCode, expiresAt);
    },

    async createSession(userData: {email: string, login: string, password: string}): Promise<registrationSessionsType> {
        const {verificationCode, expiresAt} = await this.generateVerificationCode()

        return await registrationRepository.createSession(userData, verificationCode, expiresAt);
    },

    async getActiveSession(email: string) {
        return registrationRepository.getActiveSession(email);
    },

    async verifySession(verificationCode: string): Promise<boolean> {
        return registrationRepository.verifySession(verificationCode);
    },

    deleteSession(verificationCode: string) {
        return registrationRepository.deleteSession(verificationCode);
    }
};