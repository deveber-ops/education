import { setSortAndPagination } from '../../../Core/Helpers/defaultSortAndPagination.helper.js';
import { UsersService } from '../Services/users.service.js';
import { mapToUsersListPaginatedOutput } from '../Mappers/usersListPaginated.mapper.js';
async function getUsersListHandler(req, res, next) {
  try {
    const queryInput = setSortAndPagination(req.query);
    const { items, totalCount } = await UsersService.findMany(queryInput);
    const usersListOutput = mapToUsersListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount
    });
    res.send(usersListOutput);
  } catch (error) {
    next(error);
  }
}
export {
  getUsersListHandler
};
