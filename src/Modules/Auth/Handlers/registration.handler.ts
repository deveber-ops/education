import { Request, Response, NextFunction } from "express";
import { registrationServices } from "../Services/registrationSession.service";
import { sendVerificationEmail } from "../../../Core/Mailer/mailer";
import { HttpStatus } from "../../../Core/Types/httpStatuses.enum";

export const registrationHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const path = req.path;
        const {login, email, password, code} = req.body;

        if (path === '/api/auth/registration') {
            try {
                const newSession = await registrationServices.createSession({email, login, password});
                await sendVerificationEmail(email, newSession.verificationCode);
                res.sendStatus(HttpStatus.NoContent)
            } catch (error: any) {
                return next(error)
            }
        }

        if (path === '/api/auth/registration-email-resending' && !req.isVerified) {
            try {
                await registrationServices.getActiveSession(email);
                const newVerificationCode  = await registrationServices.generateVerificationCode();
                await registrationServices.updateVerificationCode(email, newVerificationCode.verificationCode, newVerificationCode.expiresAt);
                await sendVerificationEmail(email, newVerificationCode.verificationCode);
                res.sendStatus(HttpStatus.NoContent)
            } catch (error: any) {
                return next(error)
            }
        }

        if (path === '/api/auth/registration-confirmation' && !req.isVerified) {
            await registrationServices.verifySession(code);
            await registrationServices.deleteSession(code);
            req.isVerified = true;
            return res.sendStatus(HttpStatus.NoContent)
        }
    } catch (error: any) {
        next(error);
    }
};