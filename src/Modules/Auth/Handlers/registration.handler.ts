import { Request, Response, NextFunction } from "express";
import { UsersService } from "../../Users/Services/users.service";
import { verificationError } from "../../../Core/Errors/verification.errors";
import { registrationServices } from "../Services/registrationSession.service";
import { sendVerificationEmail } from "../../../Core/Mailer/mailer";
import { HttpStatus } from "../../../Core/Types/httpStatuses.enum";

export const registrationHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { login, email, password, code } = req.body;

        if (code) {
            const isVerified = await registrationServices.verifySession(code);

            if (!isVerified) {
                req.isVerified = false;
                return next(new verificationError("Неверный или просроченный код подтверждения", "code"));
            }

            await registrationServices.deleteSession(code);
            req.isVerified = true;
            return res.sendStatus(HttpStatus.NoContent)
        }

        const existingUser = await UsersService.findUser(email);

        if (existingUser) {
            req.isVerified = false;
            return next(new verificationError("Пользователь с таким email уже существует", "email"));
        }

        const activeSession = await registrationServices.getActiveSessionByEmail(email);

        if (activeSession && !req.isVerified) {
            const resendResult = await registrationServices.resendVerificationCode(email);

            if (resendResult.success) {
                try {
                    console.log('Resending code start');
                    await sendVerificationEmail(email, resendResult.newCode!);
                    console.log('Resending code success send' + resendResult.newCode);
                } catch (mailErr) {
                    return res.sendStatus(HttpStatus.ServiceUnavailable);
                }
            }

            res.sendStatus(HttpStatus.NoContent);
        }

        if (!activeSession) {
            const newRegisterSession = await registrationServices.createSession({ email, password, login });

            try {
                console.log('Start creating new session');
                await sendVerificationEmail(email, newRegisterSession.verificationCode);

                console.log('Create new registration session');

                return res.sendStatus(HttpStatus.NoContent);
            } catch (mailErr) {
                return res.sendStatus(HttpStatus.ServiceUnavailable)
            }
        }
    } catch (error: any) {
        console.error("Registration handler error:", error);
        next(error);
    }
};