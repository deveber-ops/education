import { setSortAndPagination } from '../../../Core/Helpers/defaultSortAndPagination.helper.js';
import { CommentsService } from '../Services/comments.service.js';
import { mapToCommentListPaginatedOutput } from '../Mappers/commentsListPaginated.mapper.js';
async function getCommentsListHandler(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const queryInput = setSortAndPagination(req.query);
    const { items, totalCount } = await CommentsService.findMany(queryInput, postId);
    const commentsListOutput = mapToCommentListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount
    });
    res.send(commentsListOutput);
  } catch (error) {
    next(error);
  }
}
export {
  getCommentsListHandler
};
