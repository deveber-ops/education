import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { PostsService } from '../Services/posts.services.js';
async function createPostHandler(req, res, next) {
  try {
    const blogId = req.params.blogId ? parseInt(req.params.blogId) : null;
    const createdPost = await PostsService.create(req.body, blogId);
    res.status(HttpStatus.Created).send(createdPost);
  } catch (error) {
    next(error);
  }
}
export {
  createPostHandler
};
