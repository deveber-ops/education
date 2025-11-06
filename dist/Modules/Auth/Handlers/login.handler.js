import { AuthService } from '../Services/auth.service.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
const loginHandler = async (req, res, next) => {
  try {
    const authUser = await AuthService.login(req.body);
    res.cookie("accessToken", authUser.accessToken);
    return res.status(HttpStatus.Ok).json({
      accessToken: authUser.accessToken
    });
  } catch (error) {
    next(error);
  }
};
export {
  loginHandler
};
