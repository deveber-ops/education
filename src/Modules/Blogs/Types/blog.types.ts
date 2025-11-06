import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {Blogs} from "../../../Database/schema";
import {SortDirection} from "../../../Core/Types/sortDirections.type";

export enum BlogSortFields {
    CreatedAt = "createdAt",
}

export enum BlogSearchFields {
    name = "searchNameTerm",
}

export type Blog = InferSelectModel<typeof Blogs>;
export type BlogInputType = InferInsertModel<typeof Blogs>;

export type BlogQueryInput = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: BlogSortFields;
    sortDirection?: SortDirection;
    searchNameTerm?: string;
};

export type BlogsListPaginatedOutput = {
    page: number;
    pagesCount: number;
    pageSize: number;
    totalCount: number;
    items: Blog[];
};