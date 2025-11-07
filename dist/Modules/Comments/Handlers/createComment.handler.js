import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { authError } from '../../../Core/Errors/auth.errors.js';
import { UsersService } from '../../Users/Services/users.service.js';
import { CommentsRepository } from '../Repositories/comments.repository.js';
async function createCommentHandler(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.userId;
    if (!userId) return next(new authError("\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D", "auth"));
    const userInfo = await UsersService.findOne(userId);
    const commentData = {
      content: req.body.content,
      postId,
      commentatorInfo: {
        userId: userInfo.id,
        userLogin: userInfo.login
      }
    };
    const createdComment = await CommentsRepository.create(commentData);
    res.status(HttpStatus.Created).send(createdComment);
  } catch (error) {
    next(error);
  }
}
export {
  createCommentHandler
};
