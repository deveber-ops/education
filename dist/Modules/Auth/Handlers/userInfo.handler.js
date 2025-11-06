import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { UsersService } from '../../Users/Services/users.service.js';
import { authError } from '../../../Core/Errors/auth.errors.js';
const userInfoHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return new authError("\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D", "auth");
    const { createdAt: _, id, ...userInfo } = await UsersService.findOne(userId);
    return res.status(HttpStatus.Ok).json({
      userId: id,
      ...userInfo
    });
  } catch (error) {
    next(error);
  }
};
export {
  userInfoHandler
};
