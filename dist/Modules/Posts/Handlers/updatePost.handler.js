import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { PostsService } from '../Services/posts.services.js';
async function updatePostHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await PostsService.update(id, req.body);
    res.status(HttpStatus.NoContent).send();
  } catch (error) {
    next(error);
  }
}
export {
  updatePostHandler
};
