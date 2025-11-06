import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
import { BlogsService } from '../Services/blogs.services.js';
async function deleteBlogHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await BlogsService.delete(id);
    res.sendStatus(HttpStatus.Ok);
  } catch (error) {
    next(error);
  }
}
export {
  deleteBlogHandler
};
