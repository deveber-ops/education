import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {Posts} from "../../../Database/schema";
import {SortDirection} from "../../../Core/Types/sortDirections.type";

export enum PostSortFields {
    CreatedAt = "createdAt",
}

export type Post = InferSelectModel<typeof Posts>;
export type PostWithStringId = Omit<Post, 'id'> & { id: string };
export type PostInputType = InferInsertModel<typeof Posts>;

export type PostQueryInput = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: PostSortFields;
    sortDirection?: SortDirection;
};

export type PostsListPaginatedOutput = {
    page: number;
    pagesCount: number;
    pageSize: number;
    totalCount: number;
    items: PostWithStringId[];
};