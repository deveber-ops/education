import { authError } from '../../../Core/Errors/auth.errors.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { TokensService } from '../Services/tokens.service.js';
const logoutHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return new authError("\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D", "auth");
    const cookieRefreshToken = req.cookies?.refreshToken;
    if (!cookieRefreshToken) {
      return new authError("\u0422\u043E\u043A\u0435\u043D \u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u044F \u0441\u0435\u0441\u0441\u0438\u0438 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D..", "refreshToken");
    }
    await TokensService.deleteRefreshTokenRecord(cookieRefreshToken);
    const cookieOptions = {
      httpOnly: true,
      secure: true
    };
    res.clearCookie("refreshToken", cookieOptions);
    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    next(error);
  }
};
export {
  logoutHandler
};
