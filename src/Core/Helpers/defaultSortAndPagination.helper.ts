import {paginatedOutputType} from "../Types/paginatedOutput.type";
import {paginationAndSortingDefault} from "../Middlewares/querySortAndPagination.validation.middleware";

export function setSortAndPagination<P = string>(
    query: any,
): paginatedOutputType<P> {
    console.log(query)
    // Автоматически парсим числа
    const pageNumber = query.pageNumber ? parseInt(query.pageNumber) : paginationAndSortingDefault.pageNumber;
    const pageSize = query.pageSize ? parseInt(query.pageSize) : paginationAndSortingDefault.pageSize;

    return {
        pageNumber: Math.max(1, pageNumber),
        pageSize: Math.max(1, Math.min(100, pageSize)), // ограничиваем max размер
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
        sortDirection: query.sortDirection || paginationAndSortingDefault.sortDirection,
    };
}
