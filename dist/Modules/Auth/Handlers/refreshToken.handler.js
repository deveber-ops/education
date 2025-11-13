import { TokensService } from '../Services/tokens.service.js';
import { authError } from '../../../Core/Errors/auth.errors.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
const refreshTokenHandler = async (req, res, next) => {
  try {
    const cookieRefreshToken = req.cookies?.refreshToken;
    if (!cookieRefreshToken) return next(new authError("\u0422\u043E\u043A\u0435\u043D \u043F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u044F \u0441\u0435\u0441\u0441\u0438\u0438 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D.", "refreshToken"));
    const payloadBase64 = cookieRefreshToken.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    await TokensService.verifyRefreshToken(cookieRefreshToken);
    const newAccessToken = await TokensService.genAccessToken(payload.userData);
    const newRefreshToken = await TokensService.genRefreshToken(payload.userData);
    res.cookie("refreshToken", newRefreshToken.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(newRefreshToken.expires)
    });
    return res.status(HttpStatus.Ok).json({
      accessToken: newAccessToken.accessToken
    });
  } catch (error) {
    next(error);
  }
};
export {
  refreshTokenHandler
};
