import { BlogsService } from '../Services/blogs.services.js';
async function getBlogHandler(req, res, next) {
  console.log("GET /api/blog query:", req.query);
  try {
    const id = parseInt(req.params.id, 10);
    const user = await BlogsService.findOne(id);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
export {
  getBlogHandler
};
