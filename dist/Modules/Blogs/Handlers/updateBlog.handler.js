import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { BlogsService } from '../Services/blogs.services.js';
async function updateBlogHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await BlogsService.update(id, req.body);
    res.status(HttpStatus.NoContent).send();
  } catch (error) {
    next(error);
  }
}
export {
  updateBlogHandler
};
