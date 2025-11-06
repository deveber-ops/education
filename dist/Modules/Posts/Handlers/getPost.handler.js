import { PostsService } from '../Services/posts.services.js';
async function getPostHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await PostsService.findOne(id);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
export {
  getPostHandler
};
