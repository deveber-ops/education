import {paginatedOutputType} from "../Types/paginatedOutput.type";
import {paginationAndSortingDefault} from "../Middlewares/querySortAndPagination.validation.middleware";

export function setSortAndPagination<P = string>(
    query: Partial<paginatedOutputType<P>>,
): paginatedOutputType<P> {
    return {
        ...paginationAndSortingDefault,
        ...query,
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
    };
}
