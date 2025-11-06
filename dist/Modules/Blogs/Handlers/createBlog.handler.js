import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { BlogsService } from '../Services/blogs.services.js';
async function createBlogHandler(req, res, next) {
  try {
    const createdBlog = await BlogsService.create(req.body);
    res.status(HttpStatus.Created).send(createdBlog);
  } catch (error) {
    next(error);
  }
}
export {
  createBlogHandler
};
