import { registrationServices } from '../Services/registrationSession.service.js';
import { sendVerificationEmail } from '../../../Core/Mailer/mailer.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
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
        await registrationServices.getActiveSession(email);
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
