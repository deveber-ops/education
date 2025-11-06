import {SortDirection} from "./sortDirections.type";

export type paginatedOutputType<S> = {
    pageNumber: number
    pageSize: number
    sortBy: S
    sortDirection: SortDirection;
}