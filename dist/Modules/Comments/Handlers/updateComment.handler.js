import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { authError } from '../../../Core/Errors/auth.errors.js';
import { UsersService } from '../../Users/Services/users.service.js';
import { CommentsService } from '../Services/comments.service.js';
async function updateCommentHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId;
    if (!userId) return new authError("\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D", "auth");
    const userInfo = await UsersService.findOne(userId);
    const commentData = {
      ...req.body.commentData,
      commentatorInfo: {
        userId: userInfo.id,
        userLogin: userInfo.login
      }
    };
    await CommentsService.update(id, commentData);
    res.status(HttpStatus.NoContent).send();
  } catch (error) {
    next(error);
  }
}
export {
  updateCommentHandler
};
