import { paginationAndSortingDefault } from '../Middlewares/querySortAndPagination.validation.middleware.js';
function setSortAndPagination(query) {
  console.log(query);
  const pageNumber = query.pageNumber ? parseInt(query.pageNumber) : paginationAndSortingDefault.pageNumber;
  const pageSize = query.pageSize ? parseInt(query.pageSize) : paginationAndSortingDefault.pageSize;
  return {
    pageNumber: Math.max(1, pageNumber),
    pageSize: Math.max(1, Math.min(100, pageSize)),
    // ограничиваем max размер
    sortBy: query.sortBy ?? paginationAndSortingDefault.sortBy,
    sortDirection: query.sortDirection || paginationAndSortingDefault.sortDirection
  };
}
export {
  setSortAndPagination
};
