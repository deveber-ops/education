import { Request, Response, NextFunction } from "express";
import { UsersService } from "../../Users/Services/users.service";
import { verificationError } from "../../../Core/Errors/verification.errors";
import { registrationServices } from "../Services/registrationSession.service";
import { sendVerificationEmail } from "../../../Core/Mailer/mailer";
import { HttpStatus } from "../../../Core/Types/httpStatuses.enum";

export const registrationHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const code = req.query.code as string | undefined;

        // Верификация по коду
        if (code) {
            const isVerified = await registrationServices.verifySession(code);

            if (!isVerified) {
                return next(new verificationError("Неверный или просроченный код подтверждения", "code"));
            }

            await registrationServices.deleteSession(code);

            return res.sendStatus(HttpStatus.NoContent)
        }

        const { login, email, password } = req.body;

        const existingUser = await UsersService.findUser(email);
        if (existingUser) {
            return next(new verificationError("Пользователь с таким email уже существует", "email"));
        }

        // Проверка активной сессии
        const activeSession = await registrationServices.getActiveSessionByEmail(email);

        if (activeSession && !activeSession.isVerified) {
            const resendResult = await registrationServices.resendVerificationCode(email);

            if (resendResult.success) {
                try {
                    await sendVerificationEmail(email, resendResult.newCode!);
                } catch (mailErr) {
                    return res.sendStatus(HttpStatus.ServiceUnavailable);
                }

                return res.sendStatus(HttpStatus.NoContent)
            }

            return res.sendStatus(HttpStatus.TooManyRequests)
        }

        if (!activeSession) {
            const newRegisterSession = await registrationServices.createSession({ email, password, login });

            try {
                await sendVerificationEmail(email, newRegisterSession.verificationCode);
            } catch (mailErr) {
                return res.sendStatus(HttpStatus.ServiceUnavailable)
            }

            return res.sendStatus(HttpStatus.NoContent);
        }

        if (activeSession.isVerified) {
            return next(new verificationError("Email уже подтвержден", "email"));
        }

        return res.status(HttpStatus.BadRequest)
    } catch (error: any) {
        console.error("Registration handler error:", error);
        next(error);
    }
};