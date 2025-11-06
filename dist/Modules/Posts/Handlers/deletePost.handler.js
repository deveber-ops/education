import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { PostsService } from '../Services/posts.services.js';
async function deletePostHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await PostsService.delete(id);
    res.sendStatus(HttpStatus.Ok);
  } catch (error) {
    next(error);
  }
}
export {
  deletePostHandler
};
