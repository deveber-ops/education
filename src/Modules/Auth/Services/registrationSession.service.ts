import { randomUUID } from "node:crypto";
import { registrationRepository } from "../Repositories/verification.repository";
import { registrationSessionsType } from "../Types/auth.types";

export const registrationServices = {
    async createSession(userData: { email: string; login: string; password: string }): Promise<{ newSession: registrationSessionsType; verificationCode: string }> {
        if (!userData.email || !userData.login || !userData.password) {
            throw new Error("Missing required fields: email, login, password");
        }

        const fullUUID = randomUUID();
        const verificationCode = fullUUID.replace(/-/g, "").substring(0, 32);
        const expiresAt = new Date(Date.now() + parseInt(process.env.CONFIRMATION_CODE_EXPIRES_MINUTES || "15") * 60 * 1000);

        const newSession = await registrationRepository.createSession(userData, verificationCode, expiresAt);
        return { newSession, verificationCode };
    },

    getActiveSessionByEmail(email: string) {
        return registrationRepository.getActiveSessionByEmail(email);
    },

    async verifySession(verificationCode: string): Promise<boolean> {
        return registrationRepository.verifySession(verificationCode);
    },

    async resendVerificationCode(email: string): Promise<{ success: boolean; newCode?: string; message: string; nextResend?: number }> {
        const session = await registrationRepository.getActiveSessionByEmail(email);

        if (!session) {
            return { success: false, message: "Сессия не найдена" };
        }

        const timeSinceLastSend = Date.now() - session.lastSentAt.getTime();
        if (timeSinceLastSend < 60 * 1000) {
            const waitTime = Math.ceil((60 * 1000 - timeSinceLastSend) / 1000);
            return {
                success: false,
                message: `Пожалуйста, подождите ${waitTime} секунд перед повторной отправкой`,
                nextResend: waitTime
            };
        }

        const fullUUID = randomUUID();
        const newCode = fullUUID.replace(/-/g, "").substring(0, 32);

        const updated = await registrationRepository.resendVerificationCode(email, newCode);
        if (!updated) {
            return { success: false, message: "Не удалось обновить код" };
        }

        return { success: true, newCode, message: "Код подтверждения повторно отправлен" };
    },

    deleteSession(verificationCode: string) {
        return registrationRepository.deleteSession(verificationCode);
    }
};