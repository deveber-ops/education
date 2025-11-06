import { CommentsService } from '../Services/comments.service.js';
async function getCommentHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const comment = await CommentsService.findOne(id);
    res.send(comment);
  } catch (error) {
    next(error);
  }
}
export {
  getCommentHandler
};
