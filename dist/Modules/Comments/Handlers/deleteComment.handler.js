import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { CommentsService } from '../Services/comments.service.js';
import { authError } from '../../../Core/Errors/auth.errors.js';
import { UsersService } from '../../Users/Services/users.service.js';
async function deleteCommentHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.userId;
    if (!userId) return new authError("\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D", "auth");
    const userInfo = await UsersService.findOne(userId);
    await CommentsService.delete(id, userInfo);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    next(error);
  }
}
export {
  deleteCommentHandler
};
