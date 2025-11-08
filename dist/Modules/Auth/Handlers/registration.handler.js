import { verificationError } from '../../../Core/Errors/verification.errors.js';
import { registrationServices } from '../Services/registrationSession.service.js';
import { sendVerificationEmail } from '../../../Core/Mailer/mailer.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { UsersRepository } from '../../Users/Repositories/users.repository.js';
const registrationHandler = async (req, res, next) => {
  try {
    const { login, email, password, code } = req.body;
    if (code) {
      const isVerified = await registrationServices.verifySession(code);
      if (!isVerified) {
        req.isVerified = false;
        return next(new verificationError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u0439 \u043A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F", "code"));
      }
      await registrationServices.deleteSession(code);
      req.isVerified = true;
      return res.sendStatus(HttpStatus.NoContent);
    }
    try {
      await UsersRepository.create({ login, email, password });
    } catch (error) {
      return next(new verificationError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.", "user"));
    }
    const activeSession = await registrationServices.getActiveSessionByEmail(email);
    if (activeSession && !req.isVerified) {
      const resendResult = await registrationServices.resendVerificationCode(email);
      if (resendResult.success) {
        try {
          console.log("Resending code start");
          await sendVerificationEmail(email, resendResult.newCode);
          console.log("Resending code success send" + resendResult.newCode);
        } catch (mailErr) {
          return res.sendStatus(HttpStatus.ServiceUnavailable);
        }
      }
      res.sendStatus(HttpStatus.NoContent);
    }
    if (!activeSession) {
      const newRegisterSession = await registrationServices.createSession({ email, password, login });
      try {
        console.log("Start creating new session");
        await sendVerificationEmail(email, newRegisterSession.verificationCode);
        console.log("Create new registration session");
        return res.sendStatus(HttpStatus.NoContent);
      } catch (mailErr) {
        return res.sendStatus(HttpStatus.ServiceUnavailable);
      }
    }
  } catch (error) {
    console.error("Registration handler error:", error);
    next(error);
  }
};
export {
  registrationHandler
};
