import { setSortAndPagination } from '../../../Core/Helpers/defaultSortAndPagination.helper.js';
import { PostsService } from '../Services/posts.services.js';
import { mapToPostListPaginatedOutput } from '../Mappers/postsListPaginated.mapper.js';
async function getPostsListHandler(req, res, next) {
  try {
    const blogId = req.params.blogId ? parseInt(req.params.blogId) : null;
    const queryInput = setSortAndPagination(req.query);
    const { items, totalCount } = await PostsService.findMany(queryInput, blogId);
    const postsListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount
    });
    res.send(postsListOutput);
  } catch (error) {
    next(error);
  }
}
export {
  getPostsListHandler
};
