import { setSortAndPagination } from '../../../Core/Helpers/defaultSortAndPagination.helper.js';
import { mapToBlogListPaginatedOutput } from '../Mappers/blogsListPaginated.mapper.js';
import { BlogsService } from '../Services/blogs.services.js';
async function getBlogsListHandler(req, res, next) {
  console.log("GET /api/blogs query:", req.query);
  try {
    const queryInput = setSortAndPagination(req.query);
    const { items, totalCount } = await BlogsService.findMany(queryInput);
    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount
    });
    res.send(blogsListOutput);
  } catch (error) {
    next(error);
  }
}
export {
  getBlogsListHandler
};
