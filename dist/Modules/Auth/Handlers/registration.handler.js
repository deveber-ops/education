import { registrationServices } from '../Services/registrationSession.service.js';
import { sendVerificationEmail } from '../../../Core/Mailer/mailer.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { verificationError } from '../../../Core/Errors/verification.errors.js';
const registrationHandler = async (req, res, next) => {
  try {
    const path = req.path;
    const { login, email, password, code } = req.body;
    if (path === "/api/auth/registration") {
      try {
        const newSession = await registrationServices.createSession({ email, login, password });
        await sendVerificationEmail(email, newSession.verificationCode);
        res.sendStatus(HttpStatus.NoContent);
      } catch (error) {
        return next(error);
      }
    }
    if (path === "/api/auth/registration-email-resending" && !req.isVerified) {
      try {
        const activeSession = await registrationServices.getActiveSession(email);
        if (!activeSession) throw new verificationError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0438\u043B\u0438 \u0432\u0435\u0440\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0443\u0436\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430.", "verification");
        const newVerificationCode = await registrationServices.generateVerificationCode();
        await registrationServices.updateVerificationCode(email, newVerificationCode.verificationCode, newVerificationCode.expiresAt);
        await sendVerificationEmail(email, newVerificationCode.verificationCode);
        res.sendStatus(HttpStatus.NoContent);
      } catch (error) {
        return next(error);
      }
    }
    if (path === "/api/auth/registration-confirmation" && !req.isVerified) {
      await registrationServices.verifySession(code);
      await registrationServices.deleteSession(code);
      req.isVerified = true;
      return res.sendStatus(HttpStatus.NoContent);
    }
  } catch (error) {
    next(error);
  }
};
export {
  registrationHandler
};
