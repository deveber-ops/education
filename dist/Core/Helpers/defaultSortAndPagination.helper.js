import { paginationAndSortingDefault } from '../Middlewares/querySortAndPagination.validation.middleware.js';
function setSortAndPagination(query) {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: query.sortBy ?? paginationAndSortingDefault.sortBy
  };
}
export {
  setSortAndPagination
};
