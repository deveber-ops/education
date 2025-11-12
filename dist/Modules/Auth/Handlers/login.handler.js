import { AuthService } from '../Services/auth.service.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
const loginHandler = async (req, res, next) => {
  try {
    const authUser = await AuthService.login(req.body);
    res.cookie("accessToken", authUser.access.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(authUser.access.expires)
    }).cookie("refreshToken", authUser.refresh.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(authUser.refresh.expires)
    });
    return res.status(HttpStatus.Ok).json({
      accessToken: authUser.access.token
    });
  } catch (error) {
    next(error);
  }
};
export {
  loginHandler
};
