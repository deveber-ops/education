import { AuthService } from '../Services/auth.service.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
const loginHandler = async (req, res, next) => {
  try {
    const authUser = await AuthService.login(req.body);
    res.cookie("refreshToken", authUser.refresh.token, {
      httpOnly: true,
      secure: true,
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
